import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonSpinner,
  IonButtons, ToastController, IonModal
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, locationOutline, calendar, leaf, heart, heartOutline, informationCircle, alertCircleOutline } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { ProductOrigin, ProductTimelineEvent } from '../../models/interfaces';

interface ProductDetailView {
  product_code: string;
  name: string;
  description?: string;
  origin: string;
  location?: string;
  harvest_date: string;
  certifications?: string;
  image_url?: string;
  images: string[];
  map_url?: SafeResourceUrl;
  certificationImageUrl?: string;
  timeline?: ProductTimelineEvent[];
  quantity: number;
  unit?: string;
  price?: number;
  farmer?: { farm_name: string; location?: string };
  farming_history?: any[];
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip, IonLabel, IonSpinner,
    IonButtons, IonModal, CommonModule, FormsModule, RouterModule
  ]
})
export class ProductDetailPage implements OnInit {
  @ViewChild(IonModal) certModal?: IonModal;
  
  product: ProductDetailView | null = null;
  loading = true;
  isFavorite = false;
  showCertModal = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    private location: Location,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) {
    addIcons({ arrowBack, locationOutline, calendar, leaf, heart, heartOutline, informationCircle, alertCircleOutline });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProductByCode(id);
    }
  }

  loadProductByCode(code: string) {
    this.loading = true;
    const mock = this.productService.getMockProductByCode(code);
    if (mock) {
      this.product = this.mapOriginToView(mock);
    } else {
      this.product = null;
      this.showToast('Không tìm thấy sản phẩm (mock)');
    }
    this.loading = false;
  }

  private mapOriginToView(origin: ProductOrigin): ProductDetailView {
    const images = origin.images?.length ? origin.images : ['assets/placeholder.jpg'];
    return {
      product_code: origin.id,
      name: origin.name,
      description: origin.description,
      origin: origin.farmName,
      location: origin.location,
      harvest_date: origin.harvestDate,
      certifications: origin.certifications,
      certificationImageUrl: origin.certificationImageUrl,
      images,
      image_url: images[0],
      map_url: origin.mapEmbedUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(origin.mapEmbedUrl) : undefined,
      timeline: origin.timeline ?? [],
      quantity: 1,
      unit: 'sản phẩm',
      price: undefined,
      farmer: { farm_name: origin.farmName, location: origin.location || origin.farmName },
      farming_history: []
    };
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.showToast(this.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích');
  }

  goBack() {
    // Navigate back to the previous page (farmer-dashboard or home)
    this.location.back();
  }

  getImageUrl(imageUrl?: string | null): string {
    if (!imageUrl) {
      return 'assets/placeholder.jpg';
    }
    return imageUrl;
  }
  openCertificate() {
    this.showCertModal = true;
  }

  closeCertificate() {
    this.showCertModal = false;
    this.certModal?.dismiss();
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
