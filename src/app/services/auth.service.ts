import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, map, catchError, throwError, of, combineLatest } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, User } from '../models/interfaces';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  AuthProvider,
  signInWithCredential
} from '@angular/fire/auth';
import { getRedirectResult } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'Firebase';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private redirectLoadingSubject = new BehaviorSubject<boolean>(false);
  public redirectLoading$ = this.redirectLoadingSubject.asObservable();
  private authReadySubject = new BehaviorSubject<boolean>(false);
  public authReady$ = this.authReadySubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.restoreFromStorage();
    this.handleRedirectResultForWeb();
    this.listenAuthChanges();
  }

  private async handleRedirectResultForWeb() {
    if (Capacitor.isNativePlatform()) return;

    this.redirectLoadingSubject.next(true);
    const loading = await this.loadingCtrl.create({ message: 'Đang đồng bộ dữ liệu...' });
    await loading.present();
    try {
      const result = await getRedirectResult(this.auth as any);
      if (result?.user) {
        const { token, user } = await this.buildSessionFromFirebaseUser(result.user);
        this.persistSession(token, user);
        this.currentUserSubject.next(user);
        if (this.router.url === '/login') {
          await this.router.navigate(['/home']);
        }
      }
    } catch (err) {
      console.warn('Google redirect result error', err);
    } finally {
      this.redirectLoadingSubject.next(false);
      await loading.dismiss();
      this.authReadySubject.next(true);
    }
  }

  private listenAuthChanges() {
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser) {
        const session = await this.buildSessionFromFirebaseUser(fbUser);
        this.persistSession(session.token, session.user);
        this.currentUserSubject.next(session.user);
      } else {
        // Nếu Firebase báo null nhưng chúng ta còn session lưu local (offline / reload nhanh), giữ nguyên session
        if (this.hasStoredSession()) {
          const storedUser = this.getStoredUser();
          if (storedUser) {
            this.currentUserSubject.next(storedUser);
          }
          this.authReadySubject.next(true);
          return;
        }
        this.clearSession();
      }
      this.authReadySubject.next(true);
    });
  }

  private restoreFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.authReadySubject.next(true);
    }
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private fetchUserProfileWithTimeout(uid: string, ms = 1200): Promise<User | null> {
    return Promise.race([
      this.fetchUserProfile(uid),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), ms))
    ]);
  }

  private async fetchUserProfile(uid: string): Promise<User | null> {
    try {
      const snapshot = await getDoc(doc(this.firestore, 'users', uid));
      if (!snapshot.exists()) return null;
      return snapshot.data() as User;
    } catch (err) {
      // Offline hoặc không truy cập được Firestore: quay về null để dùng fallback user
      console.warn('fetchUserProfile skipped (offline or error)', err);
      return null;
    }
  }

  private async buildSessionFromFirebaseUser(fbUser: FirebaseUser, fallbackEmail?: string) {
    let token: string;
    let profile: User | null;
    try {
      [token, profile] = await Promise.all([
        fbUser.getIdToken(),
        this.fetchUserProfileWithTimeout(fbUser.uid)
      ]);
    } catch (err) {
      console.warn('buildSessionFromFirebaseUser fallback (offline or error)', err);
      token = await fbUser.getIdToken();
      profile = null;
    }

    const user: User = profile ?? {
      id: fbUser.uid,
      email: fbUser.email ?? fallbackEmail ?? '',
      full_name: fbUser.displayName ?? '',
      role: 'customer'
    };

    return { token, user };
  }

  private persistSession(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private hasStoredSession(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  }

  private getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (err) {
      console.warn('Failed to parse stored user', err);
      return null;
    }
  }

  private normalizeError(err: any) {
    return {
      status: 0,
      message: err?.message ?? 'Đã xảy ra lỗi',
      error: err
    };
  }

  login(credentials: LoginRequest): Observable<ApiResponse<{ token: string; user: User }>> {
    return from(signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)).pipe(
      switchMap((credential) => from(this.buildSessionFromFirebaseUser(credential.user, credentials.email))),
      map(({ token, user }) => {
        this.persistSession(token, user);
        this.currentUserSubject.next(user);
        return { success: true, data: { token, user } } satisfies ApiResponse<{ token: string; user: User }>;
      }),
        catchError((err) => throwError(() => this.normalizeError(err)))
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<{ user: User }>> {
    return from(createUserWithEmailAndPassword(this.auth, data.email, data.password)).pipe(
      switchMap((credential) => {
        const firebaseUser = credential.user;
        const profile: User = {
          id: firebaseUser.uid,
          email: data.email,
          full_name: data.email,
          role: 'customer'
        };

        return from(Promise.all([
          updateProfile(firebaseUser, { displayName: data.email }),
          setDoc(doc(this.firestore, 'users', firebaseUser.uid), profile),
          firebaseUser.getIdToken()
        ])).pipe(
          map(([, , token]) => {
            this.persistSession(token, profile);
            this.currentUserSubject.next(profile);
            return { success: true, data: { user: profile }, message: 'Đăng ký thành công' } as ApiResponse<{ user: User }>;
          })
        );
      }),
        catchError((err) => throwError(() => this.normalizeError(err)))
    );
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } finally {
      this.clearSession();
      this.currentUserSubject.next(null);
      this.redirectLoadingSubject.next(false);
      this.authReadySubject.next(true);
      await this.router.navigate(['/login']);
    }
  }

  async waitForAuthReady(timeoutMs = 2200): Promise<void> {
    const settled = () => this.authReadySubject.value && !this.redirectLoadingSubject.value;
    if (settled()) return;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        sub.unsubscribe();
        resolve();
      }, timeoutMs);

      const sub = combineLatest([this.authReady$, this.redirectLoading$]).subscribe(([ready, loading]) => {
        if (ready && !loading) {
          clearTimeout(timer);
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  ping(): Observable<ApiResponse<any>> {
    return of({ success: true, message: 'Firebase sẵn sàng' });
  }

  private loginWithProvider(provider: AuthProvider): Observable<ApiResponse<{ token: string; user: User }>> {
    // Web: use redirect to avoid popup issues on mobile browsers
    if (!Capacitor.isNativePlatform()) {
      return from(signInWithRedirect(this.auth, provider)).pipe(
        map(() => ({ success: true, message: 'Redirecting to Google for sign-in' } as ApiResponse<{ token: string; user: User }>)),
        catchError((err) => throwError(() => this.normalizeError(err)))
      );
    }

    // Native (Capacitor) flow using GoogleAuth plugin
    return from(
      GoogleAuth.signIn()
        .then((googleUser: any) => {
          const idToken = googleUser.authentication?.idToken;
          if (!idToken) throw new Error('Không lấy được idToken từ GoogleAuth');
          const credential = GoogleAuthProvider.credential(idToken);
          return signInWithCredential(this.auth, credential);
        })
    ).pipe(
      switchMap((credential) => from(this.buildSessionFromFirebaseUser(credential.user))),
      map(({ token, user }) => {
        this.persistSession(token, user);
        this.currentUserSubject.next(user);
        return { success: true, data: { token, user } } satisfies ApiResponse<{ token: string; user: User }>;
      }),
      catchError((err) => throwError(() => this.normalizeError(err)))
    );
  }

  loginWithGoogle(): Observable<ApiResponse<{ token: string; user: User }>> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return this.loginWithProvider(provider);
  }
}
