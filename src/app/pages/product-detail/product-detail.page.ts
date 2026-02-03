import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonSpinner,
  IonButtons, ToastController, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, locationOutline, calendar, leaf, heart, heartOutline, share, copy, print, download, informationCircle, alertCircleOutline } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonSpinner,
    IonButtons, CommonModule, FormsModule, RouterModule
  ]
})
export class ProductDetailPage implements OnInit {
  @ViewChild('qrWrapper', { read: ElementRef }) qrWrapper!: ElementRef;
  
  product: any = null;
  loading = true;
  isFavorite = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ arrowBack, locationOutline, calendar, leaf, heart, heartOutline, share, copy, print, download, informationCircle, alertCircleOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(parseInt(id));
    }
  }

  loadProduct(id: number) {
    this.loading = true;
    console.log('Loading product with ID:', id);
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        this.loading = false;
        if (response.success) {
          this.product = response.data;
          console.log('Product loaded:', this.product);
        } else {
          console.error('API returned success=false');
        }
      },
      error: async (error) => {
        console.error('API Error:', error);
        this.loading = false;
        await this.showToast('Không thể tải thông tin sản phẩm');
      }
    });
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.showToast(this.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
  }

  goBack() {
    // Navigate back to the previous page (farmer-dashboard or home)
    this.location.back();
  }

  getQRCodeUrl(): string {
    if (!this.product?.qr_code_url) return '';
    // Ensure URL is absolute
    if (this.product.qr_code_url.startsWith('http')) {
      return this.product.qr_code_url;
    }
    return `http://localhost:3000${this.product.qr_code_url}`;
  }

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'assets/placeholder.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:3000${imageUrl}`;
  }

  async copyQRCode() {
    try {
      // Copy product code to clipboard
      const productInfo = `Mã sản phẩm: ${this.product.product_code}\nTên: ${this.product.name}\nNguồn gốc: ${this.product.origin}`;
      await navigator.clipboard.writeText(productInfo);
      await this.showToast('Đã sao chép thông tin sản phẩm!');
    } catch (error) {
      await this.showToast('Không thể sao chép. Vui lòng thử lại.');
    }
  }

  async printQRCode() {
    const alert = await this.alertController.create({
      header: 'In mã QR',
      message: 'Bạn có muốn in mã QR này không?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'In',
          handler: () => {
            this.executePrint();
          }
        }
      ]
    });
    await alert.present();
  }

  executePrint() {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const qrUrl = this.getQRCodeUrl();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In mã QR - ${this.product.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
            }
            .qr-print-container {
              max-width: 400px;
              margin: 0 auto;
              border: 2px solid #22c55e;
              padding: 30px;
              border-radius: 10px;
            }
            h1 {
              color: #22c55e;
              font-size: 24px;
              margin-bottom: 10px;
            }
            .product-name {
              font-size: 20px;
              font-weight: bold;
              margin: 15px 0;
            }
            img {
              width: 250px;
              height: 250px;
              margin: 20px 0;
            }
            .product-code {
              font-size: 18px;
              font-weight: bold;
              margin: 15px 0;
              color: #333;
            }
            .origin {
              font-size: 14px;
              color: #666;
              margin: 10px 0;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #999;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="qr-print-container">
            <h1>🌿 Nông sản Đà Lạt</h1>
            <div class="product-name">${this.product.name}</div>
            <img src="${qrUrl}" alt="QR Code" />
            <div class="product-code">Mã: ${this.product.product_code}</div>
            <div class="origin">Xuất xứ: ${this.product.origin}</div>
            <div class="footer">Quét mã QR để truy xuất nguồn gốc</div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for image to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }
  }

  async downloadQRCode() {
    try {
      const qrUrl = this.getQRCodeUrl();
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${this.product.product_code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      await this.showToast('Đã tải mã QR về máy!');
    } catch (error) {
      await this.showToast('Không thể tải mã QR. Vui lòng thử lại.');
    }
  }

  shareProduct() {
    this.showToast('Tính năng chia sẻ sẽ được cập nhật');
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
