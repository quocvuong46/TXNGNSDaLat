import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, map, catchError, throwError, of } from 'rxjs';
import { ApiResponse, LoginRequest, RegisterRequest, User } from '../models/interfaces';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  AuthProvider
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'Firebase';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    this.restoreFromStorage();
    this.listenAuthChanges();
  }

  private listenAuthChanges() {
    onAuthStateChanged(this.auth, async (fbUser) => {
      if (fbUser) {
        const session = await this.buildSessionFromFirebaseUser(fbUser);
        this.persistSession(session.token, session.user);
        this.currentUserSubject.next(session.user);
      } else {
        this.clearSession();
      }
    });
  }

  private restoreFromStorage() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  private clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
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
        this.fetchUserProfile(fbUser.uid)
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
          full_name: data.full_name,
          phone: data.phone,
          role: 'customer'
        };

        return from(Promise.all([
          updateProfile(firebaseUser, { displayName: data.full_name }),
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
    }
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
    return from(signInWithPopup(this.auth, provider)).pipe(
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
