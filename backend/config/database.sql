-- Traceability Database Schema
-- Hệ thống truy xuất nguồn gốc nông sản Đà Lạt

CREATE DATABASE IF NOT EXISTS traceability_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE traceability_db;

-- Bảng người dùng (Users)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'farmer', 'customer') NOT NULL DEFAULT 'customer',
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Bảng thông tin nông dân (Farmers Profile)
CREATE TABLE farmers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  farm_name VARCHAR(255) NOT NULL,
  farm_address TEXT,
  district VARCHAR(100),
  province VARCHAR(100) DEFAULT 'Lâm Đồng',
  farm_area DECIMAL(10,2) COMMENT 'Diện tích (ha)',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  certifications TEXT COMMENT 'VietGAP, Organic, GlobalGAP, HACCP',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng danh mục sản phẩm (Product Categories)
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng sản phẩm nông sản (Products)
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  farmer_id INT NOT NULL,
  category_id INT,
  product_code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL COMMENT 'Số lượng (kg)',
  harvest_date DATE NOT NULL,
  expiry_date DATE,
  description TEXT,
  cultivation_method TEXT COMMENT 'Phương pháp canh tác',
  certifications VARCHAR(255) COMMENT 'VietGAP, Organic, GlobalGAP, HACCP',
  image_url TEXT,
  qr_code_url VARCHAR(255),
  status ENUM('available', 'sold', 'expired') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_product_code (product_code),
  INDEX idx_farmer (farmer_id),
  INDEX idx_status (status)
);

-- Bảng hình ảnh sản phẩm (Product Images)
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng lịch sử canh tác (Farming History)
CREATE TABLE farming_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  activity_date DATE NOT NULL,
  activity_type VARCHAR(100) NOT NULL COMMENT 'Gieo trồng, Phun thuốc, Bón phân, Thu hoạch',
  description TEXT,
  images TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
);

-- Bảng lịch sử quét QR (Scan History)
CREATE TABLE scan_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT,
  scan_location VARCHAR(255),
  ip_address VARCHAR(45),
  device_info TEXT,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_product (product_id),
  INDEX idx_scan_date (scanned_at)
);

-- Bảng yêu thích (Favorites)
CREATE TABLE favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (user_id, product_id)
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Rau lá', 'Rau xà lách, rau cải, rau muống...'),
('Hoa quả', 'Dâu tây, cà chua, dưa lưới...'),
('Củ quả', 'Cà rót, su hào, củ cải...'),
('Hoa', 'Hoa hồng, hoa cúc, hoa lan...');

-- Insert admin user (password: admin123)
INSERT INTO users (email, password, full_name, role) VALUES
('admin@dalat.com', '$2a$10$YourHashedPasswordHere', 'Quản trị viên', 'admin');
