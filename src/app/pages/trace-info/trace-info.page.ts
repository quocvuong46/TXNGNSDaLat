import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
  IonList, IonItem, IonLabel, IonButtons
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack, leaf, locationOutline, calendar, call,
  person, informationCircle, qrCode, pricetag, cube, ribbon, checkmarkCircle
} from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-trace-info',
  templateUrl: './trace-info.page.html',
  styleUrls: ['./trace-info.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
    IonList, IonItem, IonLabel, IonButtons,
    CommonModule, RouterModule
  ]
})
export class TraceInfoPage implements OnInit {
  loading = true;
  product: any = null;
  history: any[] = [];
  productCode = '';
  private assetBaseUrl = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {
    addIcons({
      arrowBack, leaf, locationOutline, calendar, call,
      person, informationCircle, qrCode, pricetag, cube, ribbon, checkmarkCircle
    });
    const apiBase = this.authService.getApiUrl();
    this.assetBaseUrl = apiBase.replace(/\/api\/?$/, '');
  }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('product_code');
    if (code) {
      this.productCode = code;
      this.loadByCode(code);
      return;
    }
    this.loading = false;
  }

  loadByCode(code: string) {
    this.loading = true;
    this.productService.traceProduct(code).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          this.product = response.data.product;
          this.history = response.data.farming_history || [];
          return;
        }
        this.product = null;
      },
      error: () => {
        this.loading = false;
        this.product = null;
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
    return `${this.assetBaseUrl}${imageUrl}`;
  }

  getQRCodeUrl(): string {
    if (!this.product?.qr_code_url) return '';
    if (this.product.qr_code_url.startsWith('http')) {
      return this.product.qr_code_url;
    }
    return `${this.assetBaseUrl}${this.product.qr_code_url}`;
  }
}
