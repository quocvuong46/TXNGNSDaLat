import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map, catchError, of, switchMap, shareReplay, concat } from 'rxjs';
import { ApiResponse, Product, ProductOrigin } from '../models/interfaces';
import { AuthService } from './auth.service';
import { Firestore, collection, deleteDoc, doc, getDoc, getDocs, setDoc, query, limit } from '@angular/fire/firestore';
import { findOriginByCode, getAllMockProducts, searchMockProducts } from './mock-data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private seeded = false;
  private seedPromise: Promise<void> | null = null;
  private cachedProducts$?: Observable<ApiResponse<Product[]>>;
  private firestoreRestBase = `https://firestore.googleapis.com/v1/projects/${environment.firebase.projectId}/databases/(default)/documents`;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private http: HttpClient
  ) {}


  private productsCol() {
    return collection(this.firestore, 'products');
  }

  private async ensureSeeded(): Promise<void> {
    if (this.seeded) return;
    if (this.seedPromise) return this.seedPromise;
    this.seedPromise = (async () => {
      const snapshot = await getDocs(query(this.productsCol(), limit(1)));
      if (snapshot.empty) {
        await this.seedMockProductsToFirestore();
      }
      this.seeded = true;
    })();
    return this.seedPromise;
  }

  async seedMockProductsToFirestore(): Promise<number> {
    const mock = getAllMockProducts();
    let written = 0;
    for (const item of mock) {
      const ref = doc(this.productsCol(), item.id);
      await setDoc(ref, item, { merge: true });
      written += 1;
    }
    return written;
  }

  getMyProducts(): Observable<ApiResponse<Product[]>> {
    if (!this.cachedProducts$) {
      const mockData = getAllMockProducts().map((p) => this.mapOriginToProduct(p));
      const live$ = from(this.ensureSeeded()).pipe(
        switchMap(() => from(getDocs(this.productsCol()))),
        map((snapshot) => {
          const data = snapshot.docs.map((d) => this.mapOriginToProduct({ id: d.id, ...d.data() } as ProductOrigin));
          return { success: true, data } as ApiResponse<Product[]>;
        }),
        catchError(() => of({ success: true, data: mockData }))
      );
      this.cachedProducts$ = concat(of({ success: true, data: mockData } as ApiResponse<Product[]>), live$).pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.cachedProducts$;
  }

  traceProduct(productCode: string): Observable<ApiResponse<any>> {
    const code = productCode.trim();
    const url = `${this.firestoreRestBase}/products/${encodeURIComponent(code)}`;
    return this.http.get<any>(url).pipe(
      map((docResp) => {
        // Firestore REST returns fields; parse minimal structure
        const fields = docResp?.fields;
        if (fields) {
          const product: ProductOrigin = {
            id: code,
            name: fields.name?.stringValue ?? code,
            description: fields.description?.stringValue,
            farmName: fields.farmName?.stringValue,
            location: fields.location?.stringValue,
            harvestDate: fields.harvestDate?.stringValue,
            certifications: fields.certifications?.stringValue,
            images: fields.images?.arrayValue?.values?.map((v: any) => v.stringValue) ?? [],
            image_url: fields.image_url?.stringValue,
            timeline: [],
            scan_count: Number(fields.scan_count?.integerValue ?? 0),
            price: Number(fields.price?.integerValue ?? fields.price?.doubleValue ?? 0),
            unit: fields.unit?.stringValue ?? 'kg',
            farmerName: fields.farmerName?.stringValue,
            farmerPhone: fields.farmerPhone?.stringValue,
            category_name: fields.category_name?.stringValue,
            qr_code_url: fields.qr_code_url?.stringValue,
            cultivation_method: fields.cultivation_method?.stringValue,
            status: fields.status?.stringValue ?? 'available'
          } as ProductOrigin;
          return { success: true, data: { product, farming_history: [] } } as ApiResponse<any>;
        }
        const mock = findOriginByCode(code);
        if (mock) {
          return { success: true, data: { product: mock, farming_history: [] } } as ApiResponse<any>;
        }
        return { success: false, message: 'Không tìm thấy sản phẩm' } as ApiResponse<any>;
      }),
      catchError(() => {
        const mock = findOriginByCode(code);
        if (mock) {
          return of({ success: true, data: { product: mock, farming_history: [] } } as ApiResponse<any>);
        }
        return of({ success: false, message: 'Không tìm thấy sản phẩm' } as ApiResponse<any>);
      })
    );
  }

  getMockProductByCode(code: string): ProductOrigin | null {
    return findOriginByCode(code);
  }

  searchProducts(keyword: string): Observable<ApiResponse<ProductOrigin[]>> {
    const results = searchMockProducts(keyword);
    return of({ success: true, data: results });
  }

  getCategories(): Observable<ApiResponse<any[]>> {
    return of({ success: true, data: [] });
  }

  createProduct(formData: FormData | Record<string, any>): Observable<ApiResponse<any>> {
    const data = formData instanceof FormData
      ? Array.from((formData as any).entries() as Iterable<[string, any]>).reduce((acc: Record<string, any>, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {})
      : formData;
    const code = (data as any)?.product_code || `QR-${Date.now()}`;
    return from(setDoc(doc(this.productsCol(), code), { ...data, id: code })).pipe(
      map(() => ({ success: true, message: 'Đã lưu sản phẩm lên Firebase' } as ApiResponse<any>)),
      catchError((err) => of({ success: false, message: err?.message || 'Lưu sản phẩm thất bại' } as ApiResponse<any>))
    );
  }

  getProductById(id: number): Observable<ApiResponse<any>> {
    return from(getDoc(doc(this.productsCol(), String(id)))).pipe(
      map((snapshot) => {
        if (snapshot.exists()) {
          return { success: true, data: snapshot.data() } as ApiResponse<any>;
        }
        const mock = findOriginByCode(String(id));
        if (mock) return { success: true, data: mock } as ApiResponse<any>;
        return { success: false, message: 'Không tìm thấy sản phẩm' } as ApiResponse<any>;
      }),
      catchError(() => of({ success: false, message: 'Không tìm thấy sản phẩm' } as ApiResponse<any>))
    );
  }

  deleteProduct(id: string | number): Observable<ApiResponse<any>> {
    const docId = String(id);
    return from(deleteDoc(doc(this.productsCol(), docId))).pipe(
      map(() => ({ success: true, message: 'Đã xóa sản phẩm' } as ApiResponse<any>)),
      catchError((err) => of({ success: false, message: err?.message || 'Xóa sản phẩm thất bại' } as ApiResponse<any>))
    );
  }

  private mapOriginToProduct(origin: ProductOrigin): Product {
    const qrUrl = origin.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(origin.id)}`;
    return {
      id: origin.id,
      product_code: origin.id,
      name: origin.name,
      quantity: origin.quantity ?? 1,
      unit: origin.unit ?? 'kg',
      harvest_date: origin.harvestDate,
      description: origin.description,
      certifications: origin.certifications,
      image_url: origin.image_url || origin.images?.[0],
      price: origin.price ?? 50000,
      status: origin.status ?? 'available',
      created_at: origin.harvestDate || new Date().toISOString(),
      scan_count: origin.scan_count ?? 0,
      farm_name: origin.farmName,
      farm_address: origin.location,
      origin: origin.location,
      qr_code_url: qrUrl,
      farmer_name: (origin as any).farmerName ?? (origin as any).farmer_name,
      farmer_phone: (origin as any).farmerPhone ?? (origin as any).farmer_phone,
      cultivation_method: (origin as any).cultivation_method,
      category_name: (origin as any).category_name ?? 'Nông sản sạch'
    };
  }
}
