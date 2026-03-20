import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { leaf, mail, lockClosed, logoGoogle } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };
  loading = false;
  socialLoading: 'google' | null = null;
  apiUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ leaf, mail, lockClosed, logoGoogle });
    this.apiUrl = this.authService.getApiUrl();
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
