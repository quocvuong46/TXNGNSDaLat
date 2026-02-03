# HƯỚNG DẪN HOÀN THIỆN CÁC PAGES IONIC

## ✅ ĐÃ HOÀN THÀNH

### Backend (100%)
- ✅ Database schema với 9 bảng
- ✅ Authentication API (login, register, JWT)
- ✅ Products API (CRUD, QR generation, traceability)
- ✅ Users API (profile, favorites)
- ✅ Categories API
- ✅ File upload & QR code generation
- ✅ Middleware (auth, role-based access)

### Frontend Structure (80%)
- ✅ Services (AuthService, ProductService, UserService)
- ✅ Guards (AuthGuard, FarmerGuard)
- ✅ Models/Interfaces
- ✅ Routing với guards
- ✅ Login page (HTML + TypeScript + SCSS)
- ✅ HttpClient configuration

---

## 🔨 CẦN BỔ SUNG

### 1. Register Page (TypeScript)
File: `src/app/pages/register/register.page.ts`

```typescript
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
    if (!this.registerData.email || !this.registerData.password || !this.registerData.full_name) {
      this.showToast('Vui lòng nhập đầy đủ thông tin');
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
        await this.showToast(error.error?.message || 'Đăng ký thất bại');
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
```

### 2. Register Page (SCSS)
File: `src/app/pages/register/register.page.scss`

```scss
.register-content {
  --background: #f5f5f5;
}

.register-container {
  padding: 20px;
}

.header {
  text-align: center;
  margin: 30px 0;
  position: relative;

  .back-btn {
    position: absolute;
    left: 0;
    top: 0;
    --color: #22c55e;
  }

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
  }

  p {
    color: #22c55e;
    font-size: 16px;
  }
}

.input-item {
  --background: white;
  --border-radius: 12px;
  margin-bottom: 15px;
  --padding-start: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  ion-icon {
    color: #22c55e;
    font-size: 20px;
    margin-right: 10px;
  }
}

.register-btn {
  --background: #22c55e;
  --border-radius: 12px;
  font-weight: bold;
  height: 50px;
  margin-top: 20px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  
  p {
    color: #666;
    
    a {
      color: #22c55e;
      font-weight: bold;
    }
  }
}
```

---

### 3. Farmer Dashboard Page
File: `src/app/pages/farmer-dashboard/farmer-dashboard.page.html`

```html
<ion-header>
  <ion-toolbar color="success">
    <ion-title>Nông sản Đà Lạt</ion-title>
    <ion-buttons slot="end">
      <ion-button routerLink="/profile">
        <ion-icon name="person" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
  <!-- Stats Cards -->
  <div class="stats-grid">
    <div class="stat-card blue">
      <h2>{{ products.length }}</h2>
      <p>Sản phẩm</p>
    </div>
    <div class="stat-card green">
      <h2>{{ getSoldCount() }}</h2>
      <p>Đã bán</p>
    </div>
  </div>

  <!-- Add Product Button -->
  <ion-button 
    expand="block" 
    color="success" 
    class="add-btn"
    routerLink="/add-product">
    <ion-icon name="add" slot="start"></ion-icon>
    Thêm sản phẩm mới
  </ion-button>

  <!-- Product List -->
  <div class="section">
    <h3>Sản phẩm của tôi</h3>
    
    <ion-card *ngFor="let product of products" class="product-card">
      <ion-card-content>
        <div class="product-info">
          <img [src]="getImageUrl(product.image_url)" alt="">
          <div class="info">
            <h4>{{ product.name }}</h4>
            <p>{{ product.quantity }} kg</p>
            <ion-badge [color]="getStatusColor(product.status)">
              {{ getStatusText(product.status) }}
            </ion-badge>
          </div>
        </div>
        <div class="actions">
          <ion-button fill="clear" size="small" (click)="viewQR(product)">
            <ion-icon name="qr-code" slot="icon-only"></ion-icon>
          </ion-button>
          <ion-button fill="clear" size="small" color="danger" (click)="deleteProduct(product.id)">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    <div *ngIf="products.length === 0" class="empty-state">
      <ion-icon name="leaf-outline"></ion-icon>
      <p>Chưa có sản phẩm nào</p>
    </div>
  </div>
</ion-content>

<!-- Bottom Tabs -->
<ion-tab-bar slot="bottom" color="success">
  <ion-tab-button tab="home" href="/farmer-dashboard">
    <ion-icon name="home"></ion-icon>
    <ion-label>Trang chủ</ion-label>
  </ion-tab-button>

  <ion-tab-button tab="search" href="/scan-qr">
    <ion-icon name="search"></ion-icon>
    <ion-label>Tìm kiếm</ion-label>
  </ion-tab-button>

  <ion-tab-button tab="add">
    <ion-icon name="qr-code"></ion-icon>
    <ion-label>Thêm</ion-label>
  </ion-tab-button>

  <ion-tab-button tab="account" href="/profile">
    <ion-icon name="person"></ion-icon>
    <ion-label>Tài khoản</ion-label>
  </ion-tab-button>
</ion-tab-bar>
```

File: `src/app/pages/farmer-dashboard/farmer-dashboard.page.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardContent, IonBadge, IonTabBar, IonTabButton, IonLabel,
  AlertController, ToastController
} from '@ionic/angular/standalone';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/interfaces';
import { addIcons } from 'ionicons';
import { person, add, qrCode, trash, home, search, leafOutline } from 'ionicons/icons';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.page.html',
  styleUrls: ['./farmer-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardContent, IonBadge, IonTabBar, IonTabButton, IonLabel,
    CommonModule, RouterModule
  ]
})
export class FarmerDashboardPage implements OnInit {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({ person, add, qrCode, trash, home, search, leafOutline });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getMyProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  getSoldCount(): number {
    return this.products.filter(p => p.status === 'sold').length;
  }

  getImageUrl(url?: string): string {
    if (!url) return 'assets/icon/favicon.png';
    return url.startsWith('http') ? url : `http://localhost:3000${url}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available': return 'success';
      case 'sold': return 'medium';
      case 'expired': return 'danger';
      default: return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'Còn hàng';
      case 'sold': return 'Đã bán';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  }

  async viewQR(product: Product) {
    const alert = await this.alertController.create({
      header: 'Mã QR - ' + product.name,
      message: `<img src="${this.getImageUrl(product.qr_code_url)}" style="width:100%">`,
      buttons: ['Đóng']
    });
    await alert.present();
  }

  async deleteProduct(id: number) {
    const alert = await this.alertController.create({
      header: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa sản phẩm này?',
      buttons: [
        { text: 'Hủy', role: 'cancel' },
        {
          text: 'Xóa',
          role: 'destructive',
          handler: () => {
            this.productService.deleteProduct(id).subscribe({
              next: async (response) => {
                if (response.success) {
                  await this.showToast('Xóa thành công');
                  this.loadProducts();
                }
              }
            });
          }
        }
      ]
    });
    await alert.present();
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
```

---

## 📋 CHECKLIST CÒN LẠI

### Pages cần hoàn thiện:
- [ ] Add Product Page (form thêm sản phẩm)
- [ ] Scan QR Page (quét mã QR)
- [ ] Product Detail Page (chi tiết sản phẩm)
- [ ] Profile Page (thông tin cá nhân)
- [ ] Home Page (trang chủ khách hàng)

### Các file SCSS cần thêm styling
- [ ] farmer-dashboard.page.scss
- [ ] add-product.page.scss
- [ ] profile.page.scss

### Testing
- [ ] Test login/register flow
- [ ] Test farmer create product
- [ ] Test QR generation
- [ ] Test product traceability

---

## 🎯 HƯỚNG DẪN TIẾP TỤC

1. Copy code từ file này vào các file tương ứng
2. Chạy `ionic serve` để test frontend
3. Chạy `npm run dev` trong thư mục backend
4. Test các chức năng từng bước

**Nếu cần hỗ trợ thêm, hãy hỏi về từng page cụ thể!**
