import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, map, catchError, throwError } from 'rxjs';
import { ApiResponse, Product } from '../models/interfaces';
import { AuthService } from './auth.service';
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://192.168.1.200:3000/api/products';

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
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: `${this.apiUrl}/my-products`,
        headers: this.getNativeHeaders(),
        params: {}
      })).pipe(
        map(result => result.data as ApiResponse<Product[]>),
        catchError((error) => this.handleNativeError(error))
      );
    }

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
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: `${this.apiUrl}/trace/${productCode}`,
        headers: this.getNativeHeaders(),
        params: {}
      })).pipe(
        map(result => result.data as ApiResponse<any>),
        catchError((error) => this.handleNativeError(error))
      );
    }

    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/trace/${productCode}`
    );
  }

  searchProducts(keyword: string): Observable<ApiResponse<Product[]>> {
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: `${this.apiUrl}/search`,
        headers: this.getNativeHeaders(),
        params: { keyword }
      })).pipe(
        map(result => result.data as ApiResponse<Product[]>),
        catchError((error) => this.handleNativeError(error))
      );
    }

    return this.http.get<ApiResponse<Product[]>>(
      `${this.apiUrl}/search?keyword=${keyword}`
    );
  }

  getCategories(): Observable<ApiResponse<any[]>> {
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: 'http://192.168.1.200:3000/api/categories',
        headers: this.getNativeHeaders(),
        params: {}
      })).pipe(
        map(result => result.data as ApiResponse<any[]>),
        catchError((error) => this.handleNativeError(error))
      );
    }

    return this.http.get<ApiResponse<any[]>>(
      'http://192.168.1.200:3000/api/categories'
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
    if (Capacitor.isNativePlatform()) {
      return from(Http.get({
        url: `${this.apiUrl}/${id}`,
        headers: this.getNativeHeaders(),
        params: {}
      })).pipe(
        map(result => result.data as ApiResponse<any>),
        catchError((error) => this.handleNativeError(error))
      );
    }

    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
