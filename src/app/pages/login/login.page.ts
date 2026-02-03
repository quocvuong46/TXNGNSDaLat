import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { leaf, mail, lockClosed } from 'ionicons/icons';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ leaf, mail, lockClosed });
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
          
          // Điều hướng dựa trên role
          if (response.data.user.role === 'farmer') {
            this.router.navigate(['/farmer-dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: async (error) => {
        this.loading = false;
        await this.showToast(error.error?.message || 'Đăng nhập thất bại');
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
}
