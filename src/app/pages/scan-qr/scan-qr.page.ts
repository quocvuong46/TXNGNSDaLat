import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
  IonInput, IonButtons, ToastController, LoadingController, AlertController, IonModal,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, qrCode, search, checkmarkCircle, closeCircle } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { BrowserMultiFormatReader, BarcodeFormat, IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { environment } from '../../../environments/environment';

declare var BarcodeDetector: any;

interface OpenFoodFactsResponse {
  status: number;
  product?: {
    product_name?: string;
    image_url?: string;
    brands?: string;
  };
}

interface UpcItemDbResponse {
  code?: string;
  items?: Array<{
    title?: string;
    brand?: string;
    images?: string[];
  }>;
}

interface ExternalProductView {
  name: string;
  brand: string;
  imageUrl?: string;
  source: 'firebase-local' | 'open-food-facts' | 'open-beauty-facts' | 'open-products-facts' | 'upcitemdb';
}

interface ScanResultProductData {
  name: string;
  brand: string;
  image: string;
  source?: 'firebase-local' | 'open-food-facts' | 'open-beauty-facts' | 'open-products-facts' | 'upcitemdb';
}

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,
    IonInput, IonButtons, IonModal, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
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
  private selectedCameraDeviceId: string | null = null;
  isResultModalOpen = false;
  productData: ScanResultProductData = {
    name: '',
    brand: '',
    image: ''
  };
  private readonly supportedBarcodeFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E
  ];
  private readonly barcodeDetectorFormats = ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e'];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private http: HttpClient
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
      await this.showToast('Thiết bị không hỗ trợ camera cho quét mã QR/mã vạch');
      return;
    }
  }

  async startScan() {
    if (this.isScanning) {
      return;
    }

    await this.ensureCameraPermission();

    if (!navigator.mediaDevices?.getUserMedia) {
      await this.showToast('Thiết bị không hỗ trợ camera cho quét mã QR/mã vạch');
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
        const videoConstraints = await this.getPreferredVideoConstraints();
        if ((videoConstraints as any).deviceId?.exact) {
          this.selectedCameraDeviceId = (videoConstraints as any).deviceId.exact;
        }
        this.stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        await this.applyTrackEnhancements(this.stream);
        videoEl.srcObject = this.stream;
        await videoEl.play();
        let detectorFormats = this.barcodeDetectorFormats;
        if (typeof BarcodeDetector?.getSupportedFormats === 'function') {
          const supported = await BarcodeDetector.getSupportedFormats();
          detectorFormats = this.barcodeDetectorFormats.filter((format) => supported.includes(format));
        }
        this.detector = new BarcodeDetector({ formats: detectorFormats });
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
      hints.set(DecodeHintType.POSSIBLE_FORMATS, this.supportedBarcodeFormats);
      this.zxingReader = new BrowserMultiFormatReader(hints);
      const videoConstraints = await this.getPreferredVideoConstraints();
      if ((videoConstraints as any).deviceId?.exact) {
        this.selectedCameraDeviceId = (videoConstraints as any).deviceId.exact;
      }
      this.zxingControls = await this.zxingReader.decodeFromConstraints(
        { video: videoConstraints, audio: false },
        videoEl,
        async (result) => {
          if (this.isProcessing) {
            return;
          }
          if (result) {
            this.isProcessing = true;
            await this.handleScanResult(result.getText());
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
        await this.handleScanResult(code);
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
    void this.handleScanResult(code);
  }

  async handleScanResult(scannedCode: string) {
    this.isProcessing = true;
    const normalized = this.normalizeCode(scannedCode);
    if (!normalized) {
      await this.showToast('Mã QR không hợp lệ');
      this.isProcessing = false;
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Đang truy xuất hệ thống toàn cầu...'
    });

    await loading.present();

    try {
      // Tầng 1: Local Firebase (Nông sản Đà Lạt)
      try {
        const localProduct = await this.lookupLocalFirebaseProduct(normalized);
        if (localProduct) {
          this.openResultModal(localProduct);
          return;
        }
      } catch (error) {
        console.warn('Tier 1 Firebase lookup failed, continue fallback', error);
      }

      // Tầng 2: Open Food Facts (thực phẩm)
      try {
        const openFoodFacts = await this.lookupOpenFoodFacts(normalized);
        const openFoodFactsProduct = this.mapOpenFactsProduct(openFoodFacts, 'open-food-facts');
        if (openFoodFactsProduct) {
          this.openResultModal(openFoodFactsProduct);
          return;
        }
      } catch (error) {
        console.warn('Tier 2 Open Food Facts failed, continue fallback', error);
      }

      // Tầng 3: Open Beauty Facts (mỹ phẩm/hóa mỹ phẩm)
      try {
        const openBeautyFacts = await this.lookupOpenBeautyFacts(normalized);
        const openBeautyFactsProduct = this.mapOpenFactsProduct(openBeautyFacts, 'open-beauty-facts');
        if (openBeautyFactsProduct) {
          this.openResultModal(openBeautyFactsProduct);
          return;
        }
      } catch (error) {
        console.warn('Tier 3 Open Beauty Facts failed, continue fallback', error);
      }

      // Tầng 4: Open Products Facts (đồ dùng chung)
      try {
        const openProductsFacts = await this.lookupOpenProductsFacts(normalized);
        const openProductsFactsProduct = this.mapOpenFactsProduct(openProductsFacts, 'open-products-facts');
        if (openProductsFactsProduct) {
          this.openResultModal(openProductsFactsProduct);
          return;
        }
      } catch (error) {
        console.warn('Tier 4 Open Products Facts failed, continue fallback', error);
      }

      // Tầng 5: UPCitemdb backup toàn cầu
      try {
        const upcItemDb = await this.lookupUpcItemDb(normalized);
        const upcItemDbProduct = this.mapUpcItemDbProduct(upcItemDb);
        if (upcItemDbProduct) {
          this.openResultModal(upcItemDbProduct);
          return;
        }
      } catch (error) {
        console.warn('Tier 5 UPCitemdb failed', error);
      }

      await this.showToast('Mã vạch chưa được cập nhật trên các kho dữ liệu mở toàn cầu.');
      await this.presentNotFoundAlert(scannedCode);
    } catch (error) {
      console.error('handleScanResult error', error);
      await this.showToast('Mã vạch chưa được cập nhật trên các kho dữ liệu mở toàn cầu.');
      await this.presentNotFoundAlert(scannedCode);
    } finally {
      await loading.dismiss();
      // Only resume scanning if we are still on the scan page
      if (this.router.url.includes('/scan-qr') && this.isScanning && !this.isResultModalOpen) {
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

  private async lookupLocalFirebaseProduct(code: string): Promise<ExternalProductView | null> {
    const url = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents/products/${encodeURIComponent(code)}`;
    try {
      const response = await firstValueFrom(this.http.get<any>(url));
      const fields = response?.fields;
      if (!fields) {
        return null;
      }

      const name = fields.name?.stringValue || fields.product_name?.stringValue || code;
      const brand =
        fields.farmName?.stringValue ||
        fields.farmerName?.stringValue ||
        fields.brand?.stringValue ||
        'Nông sản Đà Lạt';
      const imageUrl = fields.image_url?.stringValue || fields.imageUrl?.stringValue;

      return {
        name,
        brand,
        imageUrl,
        source: 'firebase-local'
      };
    } catch {
      return null;
    }
  }

  private async lookupOpenFoodFacts(code: string): Promise<OpenFoodFactsResponse | null> {
    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`;
    try {
      return await firstValueFrom(this.http.get<OpenFoodFactsResponse>(url));
    } catch (error) {
      console.error('Open Food Facts lookup failed', error);
      return null;
    }
  }

  private async lookupOpenBeautyFacts(code: string): Promise<OpenFoodFactsResponse | null> {
    const url = `https://world.openbeautyfacts.org/api/v0/product/${encodeURIComponent(code)}.json`;
    try {
      return await firstValueFrom(this.http.get<OpenFoodFactsResponse>(url));
    } catch {
      return null;
    }
  }

  private async lookupOpenProductsFacts(code: string): Promise<OpenFoodFactsResponse | null> {
    const url = `https://world.openproductsfacts.org/api/v0/product/${encodeURIComponent(code)}.json`;
    try {
      return await firstValueFrom(this.http.get<OpenFoodFactsResponse>(url));
    } catch {
      return null;
    }
  }

  private async lookupUpcItemDb(code: string): Promise<UpcItemDbResponse | null> {
    const url = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(code)}`;
    try {
      return await firstValueFrom(this.http.get<UpcItemDbResponse>(url));
    } catch (error) {
      console.error('UPCitemdb lookup failed', error);
      return null;
    }
  }

  private mapOpenFactsProduct(
    response: OpenFoodFactsResponse | null,
    source: ExternalProductView['source']
  ): ExternalProductView | null {
    if (!response || response.status !== 1 || !response.product) {
      return null;
    }

    return {
      name: response.product.product_name || 'Không rõ tên sản phẩm',
      brand: response.product.brands || 'Không rõ thương hiệu',
      imageUrl: response.product.image_url,
      source
    };
  }

  private mapUpcItemDbProduct(response: UpcItemDbResponse | null): ExternalProductView | null {
    if (!response || response.code !== 'OK' || !response.items?.length) {
      return null;
    }

    const firstItem = response.items[0];
    return {
      name: firstItem?.title || 'Không rõ tên sản phẩm',
      brand: firstItem?.brand || 'Không rõ thương hiệu',
      imageUrl: firstItem?.images?.[0],
      source: 'upcitemdb'
    };
  }

  private openResultModal(product: ExternalProductView) {
    this.productData = {
      name: product.name,
      brand: product.brand,
      image: product.imageUrl || '',
      source: product.source
    };
    this.isResultModalOpen = true;
  }

  closeResultModal() {
    this.isResultModalOpen = false;
    this.productData = {
      name: '',
      brand: '',
      image: ''
    };
    if (this.router.url.includes('/scan-qr') && this.isScanning && !this.isProcessing) {
      this.scanLoop();
    }
  }

  onResultModalDismiss() {
    this.closeResultModal();
  }

  private async getPreferredVideoConstraints(): Promise<MediaTrackConstraints> {
    const baseConstraints: MediaTrackConstraints = {
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      advanced: [{ focusMode: 'continuous' } as any]
    };

    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        return baseConstraints;
      }

      if (this.selectedCameraDeviceId) {
        return {
          ...baseConstraints,
          deviceId: { exact: this.selectedCameraDeviceId }
        };
      }

      await this.unlockCameraLabels();

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');

      const scoredCandidates = await Promise.all(
        videoInputs.map(async (device) => {
          const label = (device.label || '').toLowerCase();
          const isBack = label.includes('back') || label.includes('rear') || label.includes('environment');
          const isUltraWide =
            label.includes('ultrawide') ||
            label.includes('ultra-wide') ||
            label.includes('0.5x') ||
            label.includes('wide angle') ||
            label.includes('fisheye') ||
            label.includes('macro') ||
            label.includes('wide');
          const prefersMain = label.includes('main') || label.includes('1x') || label.includes('standard');
          const capabilityScore = await this.probeCameraQuality(device.deviceId);

          return {
            device,
            isUltraWide,
            score: (isBack ? 12 : 0) + (prefersMain ? 8 : 0) + capabilityScore - (isUltraWide ? 100 : 0)
          };
        })
      );

      const preferred = scoredCandidates
        .filter((candidate) => !candidate.isUltraWide)
        .sort((a, b) => b.score - a.score)[0]
        ?? scoredCandidates.sort((a, b) => b.score - a.score)[0];

      if (preferred?.device?.deviceId) {
        this.selectedCameraDeviceId = preferred.device.deviceId;
        return {
          ...baseConstraints,
          deviceId: { exact: preferred.device.deviceId }
        };
      }
    } catch (error) {
      console.warn('Cannot enumerate/select preferred camera', error);
    }

    return baseConstraints;
  }

  private async unlockCameraLabels(): Promise<void> {
    try {
      const current = await navigator.mediaDevices.enumerateDevices();
      const hasLabels = current.some((d) => d.kind === 'videoinput' && !!d.label);
      if (hasLabels) {
        return;
      }

      const warmup = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      warmup.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.warn('Unable to unlock camera labels', error);
    }
  }

  private async probeCameraQuality(deviceId: string): Promise<number> {
    if (!deviceId) {
      return 0;
    }

    let probeStream: MediaStream | null = null;
    try {
      probeStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      const track = probeStream.getVideoTracks()[0];
      if (!track) {
        return 0;
      }

      const capabilities = (track.getCapabilities?.() || {}) as any;
      let score = 0;

      if (Array.isArray(capabilities.focusMode) && capabilities.focusMode.includes('continuous')) {
        score += 6;
      }

      if (capabilities.zoom && typeof capabilities.zoom.max === 'number') {
        if (capabilities.zoom.max >= 2) {
          score += 8;
        } else if (capabilities.zoom.max <= 1.4) {
          score -= 6;
        }
      }

      return score;
    } catch {
      return 0;
    } finally {
      probeStream?.getTracks().forEach((track) => track.stop());
    }
  }

  private async applyTrackEnhancements(stream: MediaStream): Promise<void> {
    const track = stream.getVideoTracks()[0];
    if (!track?.applyConstraints) {
      return;
    }

    try {
      const capabilities = (track.getCapabilities?.() || {}) as any;
      const advanced: any[] = [];

      if (Array.isArray(capabilities.focusMode) && capabilities.focusMode.includes('continuous')) {
        advanced.push({ focusMode: 'continuous' });
      }

      if (capabilities.zoom && typeof capabilities.zoom.max === 'number') {
        const minZoom = typeof capabilities.zoom.min === 'number' ? capabilities.zoom.min : 1;
        const preferredZoom = Math.min(Math.max(1.2, minZoom), capabilities.zoom.max);
        if (preferredZoom > 1) {
          advanced.push({ zoom: preferredZoom });
        }
      }

      if (advanced.length > 0) {
        await track.applyConstraints({ advanced });
      }
    } catch (error) {
      console.warn('Cannot apply track enhancements', error);
    }
  }

  private async presentNotFoundAlert(scannedCode: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Không tìm thấy sản phẩm',
      message: `Mã vạch quét được: ${scannedCode}`,
      buttons: [
        {
          text: 'Đóng',
          role: 'cancel'
        },
        {
          text: 'Tìm trên Google',
          handler: () => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(scannedCode)}`, '_blank');
          }
        }
      ]
    });

    await alert.present();
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
