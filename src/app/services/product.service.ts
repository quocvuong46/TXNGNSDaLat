import { Injectable } from '@angular/core';
import { Observable, from, map, catchError, of, switchMap } from 'rxjs';
import { ApiResponse, ProductOrigin } from '../models/interfaces';
import { AuthService } from './auth.service';
import { Firestore, collection, doc, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { findOriginByCode, getAllMockProducts, searchMockProducts } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private seeded = false;

  constructor(
    private authService: AuthService,
    private firestore: Firestore
  ) {}


  private productsCol() {
    return collection(this.firestore, 'products');
  }

  private async ensureSeeded(): Promise<void> {
    if (this.seeded) return;
    const snapshot = await getDocs(this.productsCol());
    if (snapshot.empty) {
      await this.seedMockProductsToFirestore();
    }
    this.seeded = true;
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

  getMyProducts(): Observable<ApiResponse<ProductOrigin[]>> {
    return from(this.ensureSeeded()).pipe(
      switchMap(() => from(getDocs(this.productsCol()))),
      map((snapshot) => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ProductOrigin));
        return { success: true, data } as ApiResponse<ProductOrigin[]>;
      }),
      catchError(() => of({ success: true, data: getAllMockProducts() }))
    );
  }

  traceProduct(productCode: string): Observable<ApiResponse<any>> {
    const code = productCode.trim();
    return from(this.ensureSeeded()).pipe(
      switchMap(() => from(getDoc(doc(this.productsCol(), code)))),
      map((snapshot) => {
        if (snapshot.exists()) {
          const product = snapshot.data() as ProductOrigin;
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
      ? Object.fromEntries((formData as any).entries() as Iterable<[string, any]>)
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
}
