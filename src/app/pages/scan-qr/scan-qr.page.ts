import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
  IonInput, IonButtons, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, qrCode, search, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { firstValueFrom, take } from 'rxjs';
import { PRODUCT_DETAIL_MOCKS } from '../trace-info/mock-data';
import { BrowserMultiFormatReader, BarcodeFormat, IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

declare var BarcodeDetector: any;

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    IonInput, IonButtons,
    CommonModule, FormsModule, RouterModule
  ]
})

export class ScanQrPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) videoElement?: ElementRef<HTMLVideoElement>;

  manualCode = '';
  isScanning = false;
  private isProcessing = false;
  private stream: MediaStream | null = null;
  private detector: any = null;
  private scanLoopId: number | null = null;
  private permissionChecked = false;
  private warnedNoDetector = false;
  private zxingReader: BrowserMultiFormatReader | null = null;
  private zxingControls: IScannerControls | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ arrowBack, qrCode, search, checkmarkCircle, closeCircle });
  }

  async ngOnInit() {
    await this.ensureCameraPermission();
  }

  async ngAfterViewInit() {
    await this.startScan();
  }

  async ionViewWillEnter() {
    // When returning from another page, resume scanning by clearing processing lock
    this.isProcessing = false;
    if (this.router.url.includes('/scan-qr')) {
      if (this.detector && this.isScanning) {
        this.scanLoop();
      } else if (!this.isScanning) {
        await this.startScan();
      }
    }
  }

  private async ensureCameraPermission() {
    if (this.permissionChecked) return;
    this.permissionChecked = true;

    if (!navigator.mediaDevices?.getUserMedia) {
      await this.showToast('Thiết bị không hỗ trợ camera cho quét QR');
      return;
    }
  }

  async startScan() {
    if (this.isScanning) {
      return;
    }

    await this.ensureCameraPermission();

    if (!navigator.mediaDevices?.getUserMedia) {
      await this.showToast('Thiết bị không hỗ trợ camera cho quét QR');
      return;
    }

    try {
      this.isScanning = true;
      const videoEl = await this.waitForVideoElement();
      if (!videoEl) {
        this.isScanning = false;
        await this.showToast('Không thể gắn luồng camera vào khung quét');
        return;
      }

      this.applyIOSVideoAttributes(videoEl);

      if ('BarcodeDetector' in window) {
        const videoConstraints: MediaTrackConstraints = { facingMode: 'environment' };
        this.stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        videoEl.srcObject = this.stream;
        await videoEl.play();
        this.detector = new BarcodeDetector({ formats: ['qr_code'] });
        this.scanLoop();
      } else {
        await this.startZxingFallback(videoEl);
      }
    } catch (error) {
      console.error('Scan start error:', error);
      await this.showToast('Không thể bật camera. Vui lòng kiểm tra quyền truy cập.');
      this.stopScan();
    }
  }

  private async waitForVideoElement(retries = 10, delay = 100): Promise<HTMLVideoElement | null> {
    for (let i = 0; i < retries; i++) {
      if (this.videoElement?.nativeElement) {
        return this.videoElement.nativeElement;
      }
      await new Promise(res => setTimeout(res, delay));
    }
    return this.videoElement?.nativeElement ?? null;
  }

  private applyIOSVideoAttributes(videoEl: HTMLVideoElement) {
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('muted', 'true');
    videoEl.setAttribute('autoplay', 'true');
    videoEl.muted = true;
    videoEl.autoplay = true;
  }

  private async startZxingFallback(videoEl: HTMLVideoElement) {
    try {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
      this.zxingReader = new BrowserMultiFormatReader(hints);
      this.zxingControls = await this.zxingReader.decodeFromConstraints(
        { video: { facingMode: 'environment' }, audio: false },
        videoEl,
        async (result) => {
          if (this.isProcessing) {
            return;
          }
          if (result) {
            this.isProcessing = true;
            await this.handleScannedCode(result.getText());
          }
        }
      );
    } catch (err) {
      console.error('ZXing fallback error', err);
      await this.showToast('Thiết bị không hỗ trợ quét tự động, vui lòng nhập mã thủ công.');
      this.isScanning = false;
    }
  }

  stopScan() {
    this.isScanning = false;
    this.isProcessing = false;
    if (this.scanLoopId) {
      cancelAnimationFrame(this.scanLoopId);
      this.scanLoopId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.zxingControls) {
      this.zxingControls.stop();
      this.zxingControls = null;
    }
  }

  private async scanLoop() {
    if (!this.isScanning || !this.videoElement?.nativeElement) {
      return;
    }

    if (this.isProcessing) {
      this.scanLoopId = requestAnimationFrame(() => this.scanLoop());
      return;
    }

    if (!this.detector) {
      if (!this.warnedNoDetector) {
        this.warnedNoDetector = true;
        await this.showToast('Thiết bị không hỗ trợ quét tự động, vui lòng nhập mã thủ công.');
      }
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
    this.showToast('Đang tra cứu mã, vui lòng chờ...');
    void this.lookupProductByCode(code);
  }

  private async handleScannedCode(code: string) {
    this.isProcessing = true;
    await this.showToast('Đã quét thành công, đang tra cứu...');
    const normalized = this.normalizeCode(code);
    if (!normalized) {
      await this.showToast('Mã QR không hợp lệ');
      this.isProcessing = false;
      return;
    }

    try {
      await this.lookupProductByCode(normalized);
    } finally {
      // Only resume scanning if we are still on the scan page
      if (this.router.url.includes('/scan-qr') && this.isScanning) {
        this.isProcessing = false;
        this.scanLoop();
      } else {
        this.isProcessing = false;
      }
    }
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

  private async lookupProductByCode(code: string) {
    try {
      const directMock = PRODUCT_DETAIL_MOCKS.find((p) => p.id.toLowerCase() === code.toLowerCase());
      if (directMock) {
        const okMock = await this.router.navigate(['/trace', directMock.id]);
        if (!okMock) {
          await this.showToast('Không điều hướng được tới trang sản phẩm');
        }
        return;
      }

      // One-time fetch only
      const response: any = await firstValueFrom(this.productService.traceProduct(code).pipe(take(1)));
      if (response.success && response.data) {
        const product = response.data.product ?? response.data;
        const productId = (product?.id ?? product?.product_code ?? code).toString();
        if (productId) {
          // Ưu tiên trang trace (không guard) để chắc chắn hiển thị; nếu muốn chi tiết mock thì vào product-detail.
          const ok = await this.router.navigate(['/trace', productId]);
          if (!ok) {
            await this.showToast('Không điều hướng được tới trang sản phẩm');
          }
          return;
        }
      }
      await this.showToast('Không tìm thấy sản phẩm');
    } catch (error) {
      console.error('lookupProductByCode error', error);
      await this.showToast('Không tìm thấy sản phẩm với mã này');
    }
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
