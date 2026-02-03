# Traceability Backend API

API Backend cho ứng dụng truy xuất nguồn gốc nông sản Đà Lạt

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo database MySQL:
```bash
mysql -u root -p < config/database.sql
```

3. Cấu hình file .env:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=traceability_db
JWT_SECRET=your_secret_key
```

4. Chạy server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Đăng ký
- POST `/api/auth/login` - Đăng nhập

### Products
- GET `/api/products/my-products` - Lấy sản phẩm của nông dân (farmer)
- POST `/api/products` - Thêm sản phẩm (farmer)
- PUT `/api/products/:id` - Cập nhật sản phẩm (farmer)
- DELETE `/api/products/:id` - Xóa sản phẩm (farmer)
- GET `/api/products/trace/:product_code` - Truy xuất nguồn gốc (public)
- GET `/api/products/search?keyword=` - Tìm kiếm sản phẩm (public)

### Users
- GET `/api/users/profile` - Lấy thông tin user
- PUT `/api/users/profile` - Cập nhật thông tin user
- GET `/api/users/favorites` - Danh sách yêu thích
- POST `/api/users/favorites/:product_id` - Thêm/xóa yêu thích

### Categories
- GET `/api/categories` - Lấy danh sách loại sản phẩm

## Roles
- `admin` - Quản trị viên
- `farmer` - Nông dân
- `customer` - Khách hàng
