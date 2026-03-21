import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
  IonList, IonItem, IonLabel, IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack, leaf, locationOutline, calendar, call,
  person, informationCircle, qrCode, pricetag, cube, ribbon, checkmarkCircle
} from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { HistoryService } from '../../services/history.service';
import { ProductDetail, PRODUCT_DETAIL_MOCKS } from './mock-data';

@Component({
  selector: 'app-trace-info',
  templateUrl: './trace-info.page.html',
  styleUrls: ['./trace-info.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner,
    IonList, IonItem, IonLabel, IonButtons, IonBackButton,
    CommonModule, RouterModule
  ]
})
export class TraceInfoPage implements OnInit {
  loading = true;
  product: ProductDetail | null = null;
  history: ProductDetail['timeline'] = [];
  productCode = '';
  private assetBaseUrl = '';
  private mapUrlCache: SafeResourceUrl | null = null;
  private mockLookup: Map<string, ProductDetail> = new Map(
    PRODUCT_DETAIL_MOCKS.map((p) => [p.id.toLowerCase(), p])
  );
  private aliasLookup: Map<string, string> = new Map([
    ['qr-dautay-001', 'qr-dalat-001']
  ]);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private historyService: HistoryService,
    private sanitizer: DomSanitizer
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
    this.mapUrlCache = null;
    const normalized = code.toLowerCase();
    const aliased = this.aliasLookup.get(normalized) ?? normalized;
    const mock = this.mockLookup.get(aliased);
    if (mock) {
      this.product = mock;
      this.history = mock.timeline;
      // record recent view
      this.historyService.addToHistory({ id: mock.id, name: mock.name, image: mock.coverImage, dateViewed: new Date().toISOString() });
      this.loading = false;
      return;
    }

    this.productService.traceProduct(code).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data) {
          const mapped: ProductDetail = {
            id: code,
            name: response.data.product?.name ?? code,
            coverImage: response.data.product?.image_url ?? response.data.product?.images?.[0] ?? 'assets/placeholder.jpg',
            description: response.data.product?.description ?? 'Không có mô tả',
            originInfo: {
              origin: response.data.product?.origin ?? 'Đà Lạt',
              harvestDate: response.data.product?.harvest_date ?? response.data.product?.harvestDate ?? '',
              farmName: response.data.product?.farm_name ?? response.data.product?.farmName ?? '',
              address: response.data.product?.farm_address ?? response.data.product?.location ?? ''
            },
            certificate: {
              name: response.data.product?.certifications ?? 'Chưa cập nhật',
              url: response.data.product?.certificate_url ?? '#'
            },
            mapCoordinates: {
              lat: 0,
              lng: 0
            },
            timeline: response.data.farming_history ?? []
          };
          this.product = mapped;
          this.history = mapped.timeline;
          this.mapUrlCache = null;
          // record recent view
          this.historyService.addToHistory({ id: mapped.id, name: mapped.name, image: mapped.coverImage, dateViewed: new Date().toISOString() });
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
    if (!imageUrl) return 'assets/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${this.assetBaseUrl}${imageUrl}`;
  }

  getQRCodeUrl(): string {
    if (!this.product?.id) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(this.product.id)}`;
  }

  getMapEmbedUrl(): string {
    if (!this.product?.mapCoordinates) return '';
    const { lat, lng } = this.product.mapCoordinates;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  }

  getMapSafeUrl(): SafeResourceUrl | null {
    const url = this.getMapEmbedUrl();
    if (!url) return null;
    if (!this.mapUrlCache) {
      this.mapUrlCache = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return this.mapUrlCache;
  }
}
