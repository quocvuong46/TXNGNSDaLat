[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=22501052)

# 🌿 Ứng Dụng Truy Xuất Nguồn Gốc Nông Sản Đà Lạt

Ứng dụng di động giúp người tiêu dùng truy xuất nguồn gốc nông sản thông qua mã QR, đồng thời hỗ trợ nông dân quản lý sản phẩm của mình.

## ✨ Tính Năng Chính

### 👨‍🌾 Dành cho Nông Dân
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Quản lý thông tin nông trại
- ✅ Thêm sản phẩm nông sản
- ✅ Tự động tạo mã QR cho sản phẩm
- ✅ Upload hình ảnh sản phẩm
- ✅ Quản lý danh sách sản phẩm (CRUD)
- ✅ Thống kê sản phẩm đã bán/còn hàng
- ✅ Cập nhật trạng thái sản phẩm

### 👥 Dành cho Khách Hàng
- ✅ Quét mã QR trên sản phẩm
- ✅ Xem thông tin chi tiết nguồn gốc
- ✅ Xem thông tin nông trại
- ✅ Xem lịch sử canh tác
- ✅ Xem chứng nhận (VietGAP, Organic, GlobalGAP, HACCP)
- ✅ Tìm kiếm sản phẩm
- ✅ Lưu sản phẩm yêu thích
- ✅ Xem vị trí nông trại

### 🔐 Hệ Thống Phân Quyền
- **Admin**: Quản lý toàn bộ hệ thống
- **Farmer**: Quản lý sản phẩm của mình
- **Customer**: Xem và truy xuất thông tin

---

## 🏗️ Công Nghệ Sử Dụng

### Backend
- **Node.js** + **Express.js**
- **MySQL** (Database)
- **JWT** (Authentication)
- **Bcrypt** (Password hashing)
- **Multer** (File upload)
- **QRCode** (QR generation)

### Frontend
- **Ionic Framework 8**
- **Angular 20** (Standalone Components)
- **TypeScript**
- **SCSS**
- **Capacitor** (Native features)

---

## 📦 Cấu Trúc Dự Án

```
traceability/
├── backend/                    # Backend API (Node.js + Express)
│   ├── config/                 # Database config & SQL schema
│   ├── middleware/             # Auth & Upload middleware
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication
│   │   ├── products.js        # Products CRUD + QR
│   │   ├── users.js           # User profile
│   │   └── categories.js      # Product categories
│   ├── uploads/               # Uploaded images & QR codes
│   ├── .env                   # Environment variables
│   ├── server.js              # Main server file
│   └── package.json
│
├── src/                       # Frontend Ionic/Angular
│   ├── app/
│   │   ├── guards/           # Auth & Role guards
│   │   ├── models/           # TypeScript interfaces
│   │   ├── services/         # API services
│   │   ├── pages/            # App pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── farmer-dashboard/
│   │   │   ├── add-product/
│   │   │   ├── scan-qr/
│   │   │   ├── product-detail/
│   │   │   └── profile/
│   │   └── home/
│   └── theme/                # Global styles
│
├── SETUP_GUIDE.md            # Hướng dẫn cài đặt chi tiết
├── PAGES_TODO.md             # Code mẫu cho các pages
├── quick-start.ps1           # Script khởi động nhanh
└── README.md                 # File này
```

---

## 🚀 Cài Đặt Nhanh

### 1️⃣ Clone hoặc vào thư mục dự án
```bash
cd c:\Users\ASUS\OneDrive\Máy tính\UDDD\traceability
```

### 2️⃣ Cài đặt Backend
```bash
cd backend
npm install
```

### 3️⃣ Tạo Database MySQL
```bash
mysql -u root -p < config/database.sql
```

Hoặc mở **MySQL Workbench** và chạy file `backend/config/database.sql`

### 4️⃣ Cấu hình Backend
Kiểm tra file `backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=         # Để trống hoặc điền password MySQL
DB_NAME=traceability_db
JWT_SECRET=dalat_agriculture_traceability_secret_key_2026
```

### 5️⃣ Chạy Backend
```bash
# Từ thư mục backend/
npm run dev
```
✅ Backend chạy tại: `http://localhost:3000`

### 6️⃣ Cài đặt Frontend
```bash
# Về thư mục gốc traceability/
cd ..
npm install
```

### 7️⃣ Chạy Frontend
```bash
ionic serve
```
✅ Frontend chạy tại: `http://localhost:8100`

---

## 📱 Chạy Trên Thiết Bị

### Android
```bash
ionic capacitor build android
npx cap open android
```

### iOS
```bash
ionic capacitor build ios
npx cap open ios
```

---

## 🎨 Giao Diện

Ứng dụng sử dụng màu sắc chủ đạo:
- **Primary Green**: `#22c55e` (Màu xanh lá đặc trưng)
- **Dark Green**: `#16a34a`
- **Background**: `#f5f5f5`
- **Success**: Xanh lá cây

Thiết kế theo phong cách:
- Material Design
- Card-based layout
- Bottom navigation
- Responsive design

---

## 🗄️ Database Schema

### Tables
- **users**: Người dùng (admin, farmer, customer)
- **farmers**: Thông tin nông trại
- **products**: Sản phẩm nông sản + QR code
- **categories**: Danh mục (Rau lá, Hoa quả, Củ quả, Hoa)
- **farming_history**: Lịch sử canh tác
- **scan_history**: Lịch sử quét QR
- **favorites**: Sản phẩm yêu thích
- **product_images**: Hình ảnh sản phẩm

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

````

### Products (Farmer only)
- `GET /api/products/my-products` - Lấy sản phẩm
- `POST /api/products` - Thêm sản phẩm
- `PUT /api/products/:id` - Cập nhật
- `DELETE /api/products/:id` - Xóa

### Traceability (Public)
- `GET /api/products/trace/:code` - Truy xuất nguồn gốc
- `GET /api/products/search?keyword=` - Tìm kiếm

### User
- `GET /api/users/profile` - Thông tin user
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users/favorites` - Danh sách yêu thích
- `POST /api/users/favorites/:id` - Toggle favorite

### Categories
- `GET /api/categories` - Danh mục sản phẩm

---

## 🧪 Testing

### Test Backend API
```bash
# Test register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@dalat.com","password":"123456","full_name":"Test User","role":"farmer"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@dalat.com","password":"123456"}'
```

### Test Frontend
1. Đăng ký tài khoản mới (role: farmer)
2. Đăng nhập
3. Thêm sản phẩm mới
4. Xem mã QR được tạo
5. Quét mã QR (hoặc nhập code thủ công)
6. Xem thông tin truy xuất

---

## 📖 Tài Liệu Chi Tiết

- **SETUP_GUIDE.md**: Hướng dẫn cài đặt từng bước chi tiết
- **PAGES_TODO.md**: Code mẫu cho các pages còn thiếu
- **backend/README.md**: Chi tiết API backend

---

## 🐛 Xử Lý Lỗi Thường Gặp

### ❌ Lỗi kết nối MySQL
```
Error: ER_NOT_SUPPORTED_AUTH_MODE
```
**Giải pháp:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### ❌ Lỗi CORS
Backend đã cấu hình CORS. Kiểm tra firewall/antivirus.

### ❌ Lỗi Port đã được sử dụng
- Backend (3000): Đổi port trong `backend/.env`
- Frontend (8100): Tự động chuyển sang 8101, 8102...

### ❌ Lỗi HttpClient
Đảm bảo đã thêm `provideHttpClient()` trong `src/main.ts`

---

## 📞 Liên Hệ & Hỗ Trợ

- **Project**: Traceability - Nông sản Đà Lạt
- **Tech Stack**: Ionic + Angular + Node.js + MySQL
- **Version**: 1.0.0

---

## 📝 Changelog

### Version 1.0.0 (03/02/2026)
- ✅ Backend API hoàn chỉnh
- ✅ Database schema
- ✅ Authentication & Authorization
- ✅ QR Code generation
- ✅ Product management
- ✅ Traceability system
- ✅ Frontend structure
- ✅ Login/Register pages
- ✅ Services & Guards
- ✅ Routing configuration

---

## 🎯 Roadmap

### Tính năng tương lai
- [ ] Thống kê nâng cao (charts, reports)
- [ ] Thông báo real-time
- [ ] Chat giữa nông dân và khách hàng
- [ ] Đánh giá & review sản phẩm
- [ ] Tích hợp thanh toán
- [ ] Blockchain traceability
- [ ] AI nhận diện sản phẩm
- [ ] Multi-language support

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

**Phát triển với ❤️ cho nông dân Đà Lạt 🌿**
