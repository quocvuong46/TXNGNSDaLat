import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { leaf, mail, lockClosed, logoGoogle } from 'ionicons/icons';
import { Subscription, combineLatest } from 'rxjs';
import { Auth, getRedirectResult, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit, OnDestroy {
  credentials = {
    email: '',
    password: ''
  };
  loading = false;
  socialLoading: 'google' | null = null;
  apiUrl = '';
  isCheckingAuth = true;
  private authSub?: Subscription;
  private redirectSub?: Subscription;
  private redirectLoading?: HTMLIonLoadingElement;
  private readySub?: Subscription;
  private authListenerCleanup?: () => void;
  private redirectChecked = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private firebaseAuth: Auth
  ) {
    addIcons({ leaf, mail, lockClosed, logoGoogle });
    this.apiUrl = this.authService.getApiUrl();
  }

  async ngOnInit() {
    // Show loading when redirect is being processed.
    this.redirectSub = this.authService.redirectLoading$.subscribe(async (isLoading) => {
      if (isLoading) {
        if (!this.redirectLoading) {
          this.redirectLoading = await this.loadingCtrl.create({ message: 'Đang đồng bộ dữ liệu...' });
          await this.redirectLoading.present();
        }
      } else {
        if (this.redirectLoading) {
          await this.redirectLoading.dismiss();
          this.redirectLoading = undefined;
        }
      }
    });

    // Handle redirect result first to capture Google sign-in return.
    try {
      const redirectResult = await getRedirectResult(this.firebaseAuth);
      if (redirectResult?.user) {
        this.isCheckingAuth = false;
        if (this.router.url === '/login') {
          await this.router.navigate(['/home']);
        }
        this.redirectChecked = true;
        return;
      }
    } catch (err) {
      console.warn('getRedirectResult error', err);
    }
    this.redirectChecked = true;

    // Listen to auth state; only show UI when redirect is done and no user.
    this.authListenerCleanup = onAuthStateChanged(this.firebaseAuth, async (user) => {
      if (user) {
        this.isCheckingAuth = false;
        if (this.router.url === '/login') {
          await this.router.navigate(['/home']);
        }
        return;
      }
      if (this.redirectChecked) {
        this.isCheckingAuth = false;
      }
    });

    // Also react to currentUser/authReady from service to keep consistency.
    this.readySub = combineLatest([
      this.authService.currentUser$,
      this.authService.authReady$
    ]).subscribe(([user, ready]) => {
      if (user && ready && this.router.url === '/login') {
        this.isCheckingAuth = false;
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.redirectSub?.unsubscribe();
    this.readySub?.unsubscribe();
    if (this.authListenerCleanup) {
      this.authListenerCleanup();
    }
    if (this.redirectLoading) {
      this.redirectLoading.dismiss();
    }
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.showToast('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: async (response) => {
        this.loading = false;
        if (response.success && response.data) {
          await this.showToast('Đăng nhập thành công!');
          this.router.navigate(['/home']);
        } else {
          const message = response.message || 'Đăng nhập thất bại';
          await this.showToast(message);
        }
      },
      error: async (error) => {
        this.loading = false;
        let errorMessage = 'Đăng nhập thất bại';
        if (error.status === 0) {
          errorMessage = error.message || 'Không kết nối được server. Kiểm tra IP/WiFi hoặc HTTP bị chặn.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        await this.showToast(errorMessage);
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async testServer() {
    this.authService.ping().subscribe({
      next: async () => {
        await this.showToast('Kết nối server OK');
      },
      error: async (error) => {
        const message = error?.message || 'Không kết nối được server';
        await this.showToast(message);
      }
    });
  }

  loginWithGoogle() {
    if (this.socialLoading) return;
    this.socialLoading = 'google';
    this.authService.loginWithGoogle().subscribe({
      next: async (response) => {
        this.socialLoading = null;
        if (response.success && response.data) {
          await this.showToast('Đăng nhập Google thành công!');
          this.router.navigate(['/home']);
        }
      },
      error: async (error) => {
        this.socialLoading = null;
        const message = error?.message || 'Không đăng nhập Google được';
        await this.showToast(message);
      }
    });
  }
}
