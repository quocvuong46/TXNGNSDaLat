# 🌿 TXNGNSDaLat — Ứng dụng truy xuất mã QR/mã vạch (Ionic + Angular)

Ứng dụng di động/web cho phép người dùng quét **QR code** và **mã vạch 1D** để tra cứu thông tin sản phẩm.

Hiện tại dự án tập trung vào trải nghiệm người dùng cuối (consumer):
- Tra cứu nông sản nội bộ từ Firebase
- Fallback tự động qua nhiều kho dữ liệu mở toàn cầu cho hàng tiêu dùng

---

## ✨ Tính năng hiện tại

### 1) Xác thực người dùng
- Đăng ký, đăng nhập
- Guard bảo vệ các route cần đăng nhập

### 2) Quét QR + mã vạch 1D
- Hỗ trợ định dạng:
  - `QR_CODE`
  - `EAN_13`
  - `EAN_8`
  - `UPC_A`
  - `UPC_E`
- Có nhập mã thủ công khi cần

### 3) Truy vấn vét cạn 5 tầng (Exhaustive Fallback)
Trong `scan-qr`, khi quét được mã sẽ tra cứu tuần tự:

1. **Firebase local** (nông sản Đà Lạt)
2. **Open Food Facts**
3. **Open Beauty Facts**
4. **Open Products Facts**
5. **UPCitemdb**

Nếu tìm thấy ở bất kỳ tầng nào:
- Chuẩn hóa dữ liệu về `name`, `brand`, `image`
- Hiển thị bằng modal kết quả

Nếu thất bại tất cả tầng:
- Toast: `Mã vạch chưa được cập nhật trên các kho dữ liệu mở toàn cầu.`
- Alert có nút mở Google tìm theo mã vạch

### 4) Chống chọn nhầm camera ultrawide
- Ưu tiên camera sau (`back/rear/environment`)
- Loại trừ nhãn ultrawide (`ultrawide`, `0.5x`, `wide angle`, ...)
- Áp dụng constraints:
  - `facingMode: environment`
  - `1920x1080` (ideal)
  - cố gắng `focusMode: continuous`

### 5) UI truy xuất
- Trang quét mã (`scan-qr`)
- Trang xem thông tin (`trace-info`, `product-detail`)
- Modal kết quả ngoại lai cho dữ liệu từ kho mở

---

## 🧱 Tech stack

### Frontend
- Ionic 8
- Angular 20 (standalone components)
- TypeScript + SCSS
- Capacitor
- ZXing (`@zxing/browser`, `@zxing/library`)
- AngularFire + Firebase SDK

### Backend (thư mục `backend/`)
- Node.js + Express
- MySQL (`mysql2`)
- JWT, bcryptjs

> Lưu ý: hiện luồng scan chính đang dùng Firebase + open APIs ở frontend để phục vụ demo/black-box testing mã vạch thực tế.

---

## 📁 Cấu trúc chính

```text
traceability/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── scan-qr/
│   │   │   ├── trace-info/
│   │   │   ├── product-detail/
│   │   │   └── profile/
│   │   ├── services/
│   │   └── app.routes.ts
│   └── environments/
├── backend/
│   ├── server.js
│   ├── routes/
│   └── config/database.sql
├── firebase.json
└── README.md
```

---

## ⚙️ Cài đặt & chạy nhanh

### Yêu cầu
- Node.js LTS
- npm
- (Tuỳ chọn) MySQL nếu chạy backend local

### Frontend (Ionic/Angular)

```powershell
cd "c:\Users\ASUS\OneDrive\Máy tính\UDDD\traceability"
npm install
npm run start
```

Build production:

```powershell
npm run build
```

### Backend (tuỳ chọn)

```powershell
cd "c:\Users\ASUS\OneDrive\Máy tính\UDDD\traceability\backend"
npm install
npm run dev
```

Import schema DB:

```sql
-- chạy file backend/config/database.sql bằng MySQL Workbench hoặc CLI
```

---

## 🔐 Cấu hình môi trường

### Frontend
- Firebase config nằm trong:
  - `src/environments/environment.ts`
  - `src/environments/environment.prod.ts`

### Backend
- Tạo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=traceability_db
DB_PORT=3306
JWT_SECRET=your_secret_key
```

---

## 🚀 Deploy

Dự án đã cấu hình Firebase Hosting (`firebase.json`, `.firebaserc`).

Deploy frontend:

```powershell
cd "c:\Users\ASUS\OneDrive\Máy tính\UDDD\traceability"
npm run build
firebase deploy
```

---

## 🧪 Kiểm tra chất lượng

```powershell
npm run lint
npm run build
```

---

## ℹ️ Ghi chú quan trọng

- Các page/luồng farmer cũ (`farmer-dashboard`, `add-product`) đã được loại bỏ khỏi app hiện tại.
- README này mô tả đúng luồng hiện hành của nhánh đang chạy (consumer + fallback dữ liệu mở toàn cầu).

---

## 📄 License

MIT
