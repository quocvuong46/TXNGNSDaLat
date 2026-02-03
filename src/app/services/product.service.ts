import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Product } from '../models/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

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

  getMyProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      `${this.apiUrl}/my-products`,
      { headers: this.getHeaders() }
    );
  }

  addProduct(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      this.apiUrl,
      formData,
      { headers: this.getHeaders() }
    );
  }

  updateProduct(id: number, formData: FormData): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${id}`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  traceProduct(productCode: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/trace/${productCode}`
    );
  }

  searchProducts(keyword: string): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );
  }

  getCategories(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      'http://localhost:3000/api/categories'
    );
  }

  createProduct(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      this.apiUrl,
      formData,
      { headers: this.getHeaders() }
    );
  }

  getProductById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
