import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, map, catchError, throwError, of } from 'rxjs';
import { ApiResponse, Product, ProductOrigin } from '../models/interfaces';
import { AuthService } from './auth.service';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';
import { findOriginByCode, MOCK_PRODUCT_ORIGINS, searchMockProducts } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://10.61.148.125:3000/api/products';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getNativeHeaders(): { [key: string]: string } {
    const token = this.authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private handleNativeError(error: any) {
    const normalized = {
      status: error?.status ?? 0,
      message: error?.message ?? 'Native HTTP error',
      error
    };
    return throwError(() => normalized);
  }

  getMyProducts(): Observable<ApiResponse<Product[]>> {
    // Tạm dừng backend nông dân: trả về rỗng
    return of({ success: true, data: [] });
  }

  addProduct(formData: FormData | Record<string, any>): Observable<ApiResponse<any>> {
    // Tạm dừng: không thêm sản phẩm, trả success giả
    return of({ success: true, message: 'Đã tạm dừng tính năng thêm sản phẩm' });
  }

  updateProduct(id: number, formData: FormData): Observable<ApiResponse<any>> {
    return of({ success: false, message: 'Đã tạm dừng tính năng cập nhật sản phẩm' });
  }

  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return of({ success: false, message: 'Đã tạm dừng tính năng xóa sản phẩm' });
  }

  traceProduct(productCode: string): Observable<ApiResponse<any>> {
    const mock = findOriginByCode(productCode);
    if (mock) {
      return of({
        success: true,
        data: {
          product: mock,
          farming_history: []
        }
      } as ApiResponse<any>);
    }

    return of({ success: false, message: 'Không tìm thấy sản phẩm (mock)' });
  }

  // Lấy chi tiết mock theo mã QR/code
  getMockProductByCode(code: string): ProductOrigin | null {
    return findOriginByCode(code);
  }

  searchProducts(keyword: string): Observable<ApiResponse<Product[]>> {
    const results = searchMockProducts(keyword);
    // ép kiểu nhẹ sang Product[] optional fields
    return of({ success: true, data: results as unknown as Product[] });
  }

  getCategories(): Observable<ApiResponse<any[]>> {
    return of({ success: true, data: [] });
  }

  createProduct(formData: FormData | Record<string, any>): Observable<ApiResponse<any>> {
    return of({ success: false, message: 'Đã tạm dừng tính năng thêm sản phẩm' });
  }

  getProductById(id: number): Observable<ApiResponse<any>> {
    return of({ success: false, message: 'Đã tạm dừng tính năng xem chi tiết sản phẩm' });
  }
}
