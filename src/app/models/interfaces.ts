export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

export interface Product {
  id: string | number;
  product_code?: string;
  name: string;
  category_name?: string;
  quantity?: number;
  harvest_date?: string;
  description?: string;
  cultivation_method?: string;
  certifications?: string;
  image_url?: string;
  qr_code_url?: string;
  status?: 'available' | 'sold' | 'expired';
  farm_name?: string;
  farm_address?: string;
  district?: string;
  farmer_name?: string;
  farmer_phone?: string;
  created_at?: string;
  price?: number;
  unit?: string;
  origin?: string;
  scan_count?: number;
}

// Dùng cho truy xuất nguồn gốc mock (QR -> thông tin nông sản)
export interface ProductTimelineEvent {
  date: string;
  title: string;
  detail?: string;
}

export interface ProductOrigin {
  id: string;              // mã mô phỏng từ QR
  name: string;            // tên sản phẩm
  farmName: string;        // tên nhà vườn
  location?: string;       // địa chỉ tóm tắt
  harvestDate: string;     // ngày thu hoạch (ISO hoặc dd/MM/yyyy)
  certifications: string;  // VietGAP/GlobalGAP...
  description: string;     // mô tả chi tiết
  certificationImageUrl?: string;
  images?: string[];       // ảnh sản phẩm/thực tế
  mapEmbedUrl?: string;    // iframe map url
  timeline?: ProductTimelineEvent[]; // hành trình
  // Optional commerce-style fields for UI reuse
  price?: number;
  quantity?: number;
  unit?: string;
  image_url?: string;
  scan_count?: number;
  farmerName?: string;
  farmerPhone?: string;
  category_name?: string;
  qr_code_url?: string;
  cultivation_method?: string;
  status?: 'available' | 'sold' | 'expired';
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
  role?: 'customer';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
