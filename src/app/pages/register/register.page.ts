import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, IonSelect, IonSelectOption,
  ToastController 
} from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/interfaces';
import { addIcons } from 'ionicons';
import { person, mail, call, lockClosed, people, arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonInput, IonButton, IonIcon, IonSpinner, IonSelect, IonSelectOption,
    CommonModule, FormsModule, RouterModule
  ]
})
export class RegisterPage {
  registerData: RegisterRequest = {
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'customer'
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ person, mail, call, lockClosed, people, arrowBack });
  }

  async onRegister() {
    // Validate đầy đủ thông tin
    if (!this.registerData.email || !this.registerData.password || !this.registerData.full_name) {
      this.showToast('Vui lòng nhập đầy đủ thông tin');
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

    // Validate phone (nếu có nhập)
    if (this.registerData.phone && this.registerData.phone.length < 10) {
      this.showToast('Số điện thoại không hợp lệ');
      return;
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: async (response) => {
        this.loading = false;
        if (response.success) {
          await this.showToast('Đăng ký thành công! Vui lòng đăng nhập.');
          this.router.navigate(['/login']);
        }
      },
      error: async (error) => {
        this.loading = false;
        // Hiển thị lỗi chi tiết từ backend
        let errorMessage = 'Đăng ký thất bại';
        if (error.status === 0) {
          errorMessage = 'Không kết nối được server. Kiểm tra IP/WiFi hoặc HTTP bị chặn.';
        }
        if (error.error?.errors && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0].msg;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
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
}
