import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { RegisterRequest } from '../../models/interfaces';
import { addIcons } from 'ionicons';
import { mail, lockClosed, arrowBack } from 'ionicons/icons';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner,
    CommonModule, FormsModule, RouterModule
  ]
})
export class RegisterPage {
  registerData: RegisterRequest = {
    email: '',
    password: ''
  };
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ mail, lockClosed, arrowBack });
  }

  async onRegister() {
    // Validate đầy đủ thông tin
    if (!this.registerData.email || !this.registerData.password) {
      this.showToast('Vui lòng nhập email và mật khẩu');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.showToast('Email không hợp lệ');
      return;
    }

    // Validate password length
    if (this.registerData.password.length < 6) {
      this.showToast('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    this.loading = true;
    try {
      await createUserWithEmailAndPassword(this.auth, this.registerData.email, this.registerData.password);
      this.showToast('Đăng ký thành công! Đang chuyển sang đăng nhập...');
      this.router.navigate(['/login']);
    } catch (error: any) {
      let errorMessage = 'Đăng ký thất bại';
      if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'Email đã được sử dụng.';
      } else if (error?.code === 'auth/network-request-failed') {
        errorMessage = 'Không kết nối được server. Kiểm tra mạng/WiFi.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      this.showToast(errorMessage);
    } finally {
      this.loading = false;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}
