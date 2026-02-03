# Hướng Dẫn Khởi Tạo Database

## Cách 1: Sử dụng MySQL Command Line

### Bước 1: Mở Command Prompt hoặc PowerShell
```bash
mysql -u root -p
```

### Bước 2: Nhập password MySQL (nếu có)

### Bước 3: Tạo database
```sql
CREATE DATABASE IF NOT EXISTS traceability_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traceability_db;
```

### Bước 4: Import schema
```bash
# Thoát khỏi MySQL (gõ exit;)
# Sau đó chạy lệnh này:
mysql -u root -p traceability_db < config/database.sql
```

---

## Cách 2: Sử dụng MySQL Workbench

### Bước 1: Mở MySQL Workbench

### Bước 2: Connect to MySQL Server
- Host: localhost
- Port: 3306
- Username: root
- Password: (your password)

### Bước 3: Mở file SQL
1. File → Open SQL Script
2. Chọn file: `backend/config/database.sql`

### Bước 4: Execute
1. Click icon lightning bolt ⚡ hoặc Ctrl+Shift+Enter
2. Chờ script chạy xong
3. Refresh Schemas panel để thấy database mới

---

## Cách 3: Sử dụng phpMyAdmin

### Bước 1: Truy cập phpMyAdmin
```
http://localhost/phpmyadmin
```

### Bước 2: Tạo database
1. Click tab "Databases"
2. Tên database: `traceability_db`
3. Collation: `utf8mb4_unicode_ci`
4. Click "Create"

### Bước 3: Import SQL file
1. Click vào database `traceability_db` vừa tạo
2. Click tab "Import"
3. Click "Choose File" và chọn `backend/config/database.sql`
4. Click "Go" ở cuối trang

---

## Kiểm Tra Database Đã Tạo Thành Công

### Trong MySQL:
```sql
USE traceability_db;
SHOW TABLES;
```

### Kết quả mong đợi (9 tables):
```
+-----------------------------+
| Tables_in_traceability_db   |
+-----------------------------+
| categories                  |
| farmers                     |
| farming_history             |
| favorites                   |
| product_images              |
| products                    |
| scan_history                |
| users                       |
+-----------------------------+
```

### Kiểm tra dữ liệu mẫu:
```sql
SELECT * FROM categories;
```

Kết quả mong đợi:
```
+----+----------+---------------------------+
| id | name     | description               |
+----+----------+---------------------------+
|  1 | Rau lá   | Rau xà lách, rau cải...  |
|  2 | Hoa quả  | Dâu tây, cà chua...      |
|  3 | Củ quả   | Cà rót, su hào...        |
|  4 | Hoa      | Hoa hồng, hoa cúc...     |
+----+----------+---------------------------+
```

---

## Troubleshooting

### Lỗi: Access denied for user 'root'@'localhost'

**Giải pháp:**
```sql
# Đăng nhập MySQL với user có quyền cao hơn
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

### Lỗi: ER_NOT_SUPPORTED_AUTH_MODE

**Giải pháp:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
```

### Lỗi: Database already exists

**Giải pháp:**
```sql
DROP DATABASE IF EXISTS traceability_db;
# Sau đó chạy lại script tạo database
```

### Lỗi: Table already exists

**Giải pháp:**
Xóa tất cả tables và chạy lại:
```sql
USE traceability_db;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS users, farmers, products, categories, 
                      product_images, farming_history, scan_history, favorites;
SET FOREIGN_KEY_CHECKS = 1;
# Sau đó chạy lại script
```

---

## Tạo Admin User

### Bước 1: Hash password
Sử dụng bcrypt online tool hoặc Node.js:

```javascript
// Trong Node.js console
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

### Bước 2: Insert vào database
```sql
INSERT INTO users (email, password, full_name, role) VALUES
('admin@dalat.com', 'YOUR_HASHED_PASSWORD_HERE', 'Quản trị viên', 'admin');
```

Hoặc sử dụng API Register để tạo user admin sau đó update role trong database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

---

## Test Database Connection

### Từ Backend:
```bash
cd backend
node -e "require('./config/database').getConnection().then(c => {console.log('✅ Connected!'); c.release();}).catch(e => console.error('❌ Error:', e.message))"
```

Kết quả mong đợi:
```
✅ Kết nối MySQL thành công!
```

---

## Database Schema Overview

### users (Người dùng)
- id, email, password, full_name, phone, role, avatar, is_active
- **Roles**: admin, farmer, customer

### farmers (Nông trại)
- id, user_id, farm_name, farm_address, district, province, certifications

### products (Sản phẩm)
- id, farmer_id, category_id, product_code, name, quantity, harvest_date
- qr_code_url, image_url, status (available, sold, expired)

### categories (Danh mục)
- id, name, description, icon

### farming_history (Lịch sử canh tác)
- id, product_id, activity_date, activity_type, description

### scan_history (Lịch sử quét QR)
- id, product_id, user_id, scan_location, scanned_at

### favorites (Yêu thích)
- id, user_id, product_id

### product_images (Hình ảnh sản phẩm)
- id, product_id, image_url, is_primary

---

**Sau khi hoàn tất, quay lại `SETUP_GUIDE.md` để tiếp tục!**
