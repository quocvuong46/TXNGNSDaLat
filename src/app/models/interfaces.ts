export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'farmer' | 'customer';
  avatar?: string;
  farmer?: FarmerProfile;
}

export interface FarmerProfile {
  id: number;
  user_id: number;
  farm_name: string;
  farm_address?: string;
  district?: string;
  province?: string;
  certifications?: string;
}

export interface Product {
  id: number;
  product_code: string;
  name: string;
  category_name?: string;
  quantity: number;
  harvest_date: string;
  description?: string;
  cultivation_method?: string;
  certifications?: string;
  image_url?: string;
  qr_code_url?: string;
  status: 'available' | 'sold' | 'expired';
  farm_name?: string;
  farmer_name?: string;
  farmer_phone?: string;
  created_at: string;
  price?: number;
  unit?: string;
  origin?: string;
  scan_count?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: 'farmer' | 'customer';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
