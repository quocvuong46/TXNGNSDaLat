# Hướng Dẫn Cài Đặt và Chạy Ứng Dụng

## 🌿 Ứng Dụng Truy Xuất Nguồn Gốc Nông Sản Đà Lạt

### 📋 Yêu Cầu Hệ Thống
- Node.js (v16 trở lên)
- MySQL (v8.0 trở lên)
- Ionic CLI
- Angular CLI

---

## 🔧 PHẦN 1: CÀI ĐẶT BACKEND

### Bước 1: Cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 2: Tạo database MySQL
1. Mở MySQL Workbench hoặc command line:
```bash
mysql -u root -p
```

2. Chạy script tạo database:
```bash
mysql -u root -p < config/database.sql
```

Hoặc copy nội dung file `backend/config/database.sql` và chạy trong MySQL Workbench.

### Bước 3: Cấu hình .env
File `.env` đã được tạo sẵn với cấu hình mặc định:
- `DB_PASSWORD=` (để trống nếu MySQL không có password)
- Nếu có password, sửa lại: `DB_PASSWORD=your_password`

### Bước 4: Chạy backend server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 📱 PHẦN 2: CÀI ĐẶT IONIC FRONTEND

### Bước 1: Cài đặt dependencies
```bash
# Từ thư mục gốc traceability
npm install
```

### Bước 2: Cài thêm các package cần thiết
```bash
npm install @angular/common@^20.0.0 @angular/platform-browser@^20.0.0
npm install @capacitor/camera @capacitor-community/barcode-scanner
```

### Bước 3: Cập nhật app.config.ts
Tạo file `src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

### Bước 4: Cập nhật main.ts
Sửa file `src/main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

### Bước 5: Chạy ứng dụng
```bash
ionic serve
```

Ứng dụng sẽ mở tại: `http://localhost:8100`

---

## 🎨 PHẦN 3: CẤU TRÚC DỰ ÁN

### Backend API Endpoints
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/products/my-products` - Lấy sản phẩm của nông dân
- `POST /api/products` - Thêm sản phẩm mới
- `GET /api/products/trace/:code` - Truy xuất nguồn gốc
- `GET /api/categories` - Lấy danh mục

### Frontend Pages
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/home` - Trang chủ (khách hàng)
- `/farmer-dashboard` - Dashboard nông dân
- `/add-product` - Thêm sản phẩm (nông dân)
- `/scan-qr` - Quét mã QR
- `/product-detail/:id` - Chi tiết sản phẩm
- `/profile` - Trang cá nhân

### Database Tables
- `users` - Người dùng (admin, farmer, customer)
- `farmers` - Thông tin nông trại
- `products` - Sản phẩm nông sản
- `categories` - Danh mục sản phẩm
- `farming_history` - Lịch sử canh tác
- `scan_history` - Lịch sử quét QR
- `favorites` - Danh sách yêu thích

---

## 🚀 PHẦN 4: TESTING

### Test Backend API
```bash
# Đăng ký user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "123456",
    "full_name": "Nguyễn Văn A",
    "role": "farmer"
  }'

# Đăng nhập
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "123456"
  }'
```

### Tài khoản test mặc định
- **Admin**: `admin@dalat.com` / `admin123` (cần hash password trong DB)
- Tạo tài khoản farmer và customer qua form đăng ký

---

## 📝 PHẦN 5: CẤU HÌNH THÊM

### Cấu hình QR Scanner cho mobile
```bash
npm install @capacitor-community/barcode-scanner
npx cap sync
```

### Cấu hình Camera
```bash
npm install @capacitor/camera
npx cap sync
```

### Build cho Android
```bash
ionic capacitor build android
npx cap open android
```

### Build cho iOS
```bash
ionic capacitor build ios
npx cap open ios
```

---

## 🎯 TÍNH NĂNG CHÍNH

### Khách hàng:
- ✅ Quét mã QR sản phẩm
- ✅ Xem thông tin truy xuất nguồn gốc
- ✅ Tìm kiếm sản phẩm
- ✅ Lưu sản phẩm yêu thích
- ✅ Xem lịch sử canh tác

### Nông dân:
- ✅ Đăng nhập/Đăng ký
- ✅ Thêm sản phẩm mới
- ✅ Quản lý danh sách sản phẩm
- ✅ Tạo mã QR tự động
- ✅ Upload hình ảnh sản phẩm
- ✅ Cập nhật thông tin nông trại
- ✅ Thống kê sản phẩm đã bán/còn hàng

### Admin:
- ✅ Quản lý người dùng
- ✅ Quản lý toàn bộ sản phẩm
- ✅ Xem thống kê hệ thống

---

## 🐛 TROUBLESHOOTING

### Lỗi kết nối MySQL
```
ER_NOT_SUPPORTED_AUTH_MODE
```
**Giải pháp:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Lỗi CORS
Backend đã cấu hình CORS. Nếu vẫn bị lỗi, kiểm tra firewall/antivirus.

### Lỗi import HttpClient
Đảm bảo đã thêm `provideHttpClient()` trong `app.config.ts`

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. MySQL server đang chạy
2. Backend server đang chạy (port 3000)
3. Frontend có kết nối được backend API
4. Console log để xem chi tiết lỗi

---

## 🎨 MÀUSẮC THIẾT KẾ

- Primary Green: `#22c55e`
- Dark Green: `#16a34a`
- Background: `#f5f5f5`
- Text: `#333333`
- Border: `#e5e5e5`

---

**Chúc bạn phát triển ứng dụng thành công! 🌿✨**
