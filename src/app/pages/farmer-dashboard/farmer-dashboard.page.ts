import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
  IonFab, IonFabButton, IonSpinner, IonRefresher, IonRefresherContent,
  IonTabBar, IonTabButton, IonLabel, IonButtons,
  ToastController, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, qrCode, leaf, eye, arrowBack, cube, addCircle, chevronForward, home, search, person, notifications, notificationsOutline, trash } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/interfaces';

@Component({
  selector: 'app-farmer-dashboard',
  templateUrl: './farmer-dashboard.page.html',
  styleUrls: ['./farmer-dashboard.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol,
    IonFab, IonFabButton, IonSpinner, IonRefresher, IonRefresherContent,
    IonTabBar, IonTabButton, IonLabel, IonButtons,
    CommonModule, FormsModule, RouterModule
  ]
})
export class FarmerDashboardPage implements OnInit {
  products: Product[] = [];
  loading = true;
  stats = {
    totalProducts: 0,
    totalScans: 0
  };

  constructor(
    private productService: ProductService,
    public router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    addIcons({ add, qrCode, leaf, eye, arrowBack, cube, addCircle, chevronForward, home, search, person, notifications, notificationsOutline, trash });
  }

  ngOnInit() {
    this.loadProducts();
  }

  ionViewWillEnter() {
    // Reload products every time the page is entered
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getMyProducts().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.products = response.data || [];
          this.calculateStats();
        }
      },
      error: async (error) => {
        this.loading = false;
        await this.showToast('Không thể tải danh sách sản phẩm');
      }
    });
  }

  calculateStats() {
    this.stats.totalProducts = this.products.length;
    this.stats.totalScans = this.products.reduce((sum, p) => sum + (p.scan_count || 0), 0);
  }

  goToAddProduct() {
    this.router.navigate(['/add-product']);
  }

  goToProductDetail(productId: number) {
    this.router.navigate(['/product-detail', productId]);
  }

  async confirmDelete(product: Product, event: Event) {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Xóa sản phẩm',
      message: `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`,
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Xóa',
          role: 'destructive',
          handler: () => this.deleteProduct(product.id)
        }
      ]
    });
    await alert.present();
  }

  private deleteProduct(productId?: number) {
    if (!productId) {
      this.showToast('Không tìm thấy sản phẩm để xóa');
      return;
    }
    this.productService.deleteProduct(productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.products = this.products.filter((p) => p.id !== productId);
          this.calculateStats();
          this.showToast('Đã xóa sản phẩm');
        } else {
          this.showToast('Xóa sản phẩm thất bại');
        }
      },
      error: async () => {
        await this.showToast('Xóa sản phẩm thất bại');
      }
    });
  }

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'assets/placeholder.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // Build absolute URL from API base (remove /api if present)
    const apiBase = this.authService.getApiUrl();
    const assetBase = apiBase.replace(/\/api\/?$/, '');
    return `${assetBase}${imageUrl}`;
  }

  handleRefresh(event: any) {
    this.loadProducts();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
