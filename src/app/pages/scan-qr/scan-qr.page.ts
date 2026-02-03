import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
  IonCardContent, IonInput, IonItem, IonButtons, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, qrCode, search, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';

declare var BarcodeDetector: any;

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonCard,
    IonCardContent, IonInput, IonItem, IonButtons,
    CommonModule, FormsModule, RouterModule
  ]
})

export class ScanQrPage implements OnInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;

  manualCode = '';
  isScanning = false;
  private stream: MediaStream | null = null;
  private detector: any = null;
  private scanLoopId: number | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ arrowBack, qrCode, search, checkmarkCircle, closeCircle });
  }

  ngOnInit() {}

  async startScan() {
    if (this.isScanning) {
      return;
    }

    if (!('BarcodeDetector' in window)) {
      await this.showToast('Thiết bị không hỗ trợ quét QR. Vui lòng nhập mã thủ công.');
      return;
    }

    try {
      this.detector = new BarcodeDetector({ formats: ['qr_code'] });
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.isScanning = true;

      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();
        this.scanLoop();
      }
    } catch (error) {
      console.error('Scan start error:', error);
      await this.showToast('Không thể bật camera. Vui lòng kiểm tra quyền truy cập.');
      this.stopScan();
    }
  }

  stopScan() {
    this.isScanning = false;
    if (this.scanLoopId) {
      cancelAnimationFrame(this.scanLoopId);
      this.scanLoopId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  private async scanLoop() {
    if (!this.isScanning || !this.videoElement?.nativeElement || !this.detector) {
      return;
    }

    try {
      const barcodes = await this.detector.detect(this.videoElement.nativeElement);
      if (barcodes.length > 0) {
        const code = barcodes[0].rawValue;
        await this.handleScannedCode(code);
        return;
      }
    } catch (error) {
      console.error('Scan error:', error);
    }

    this.scanLoopId = requestAnimationFrame(() => this.scanLoop());
  }

  searchByCode() {
    const code = this.normalizeCode(this.manualCode);
    if (!code) {
      this.showToast('Vui lòng nhập mã sản phẩm');
      return;
    }

    this.lookupProductByCode(code);
  }

  private async handleScannedCode(code: string) {
    this.stopScan();
    await this.showToast('Đã quét thành công, đang tra cứu...');
    const normalized = this.normalizeCode(code);
    if (!normalized) {
      await this.showToast('Mã QR không hợp lệ');
      return;
    }
    this.lookupProductByCode(normalized);
  }

  private normalizeCode(input: string): string {
    const value = input?.trim();
    if (!value) {
      return '';
    }

    if (value.startsWith('http')) {
      try {
        const url = new URL(value);
        const parts = url.pathname.split('/').filter(Boolean);
        const traceIndex = parts.indexOf('trace');
        if (traceIndex >= 0 && parts[traceIndex + 1]) {
          return parts[traceIndex + 1];
        }
      } catch (error) {
        console.error('Invalid URL in QR:', error);
      }
    }

    if (value.startsWith('{')) {
      try {
        const payload = JSON.parse(value);
        if (payload?.product_code) {
          return payload.product_code;
        }
      } catch (error) {
        console.error('Invalid JSON in QR:', error);
      }
    }

    return value;
  }

  private lookupProductByCode(code: string) {
    this.productService.traceProduct(code).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          const productId = response.data.id || response.data.product?.id;
          if (productId) {
            this.router.navigate(['/product-detail', productId]);
            return;
          }
          this.showToast('Không tìm thấy sản phẩm');
        } else {
          this.showToast('Không tìm thấy sản phẩm');
        }
      },
      error: async () => {
        await this.showToast('Không tìm thấy sản phẩm với mã này');
      }
    });
  }

  ngOnDestroy() {
    this.stopScan();
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
