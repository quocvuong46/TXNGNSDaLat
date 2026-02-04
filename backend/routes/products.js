const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Lấy danh sách sản phẩm của nông dân
router.get('/my-products', authMiddleware, roleMiddleware('farmer'), async (req, res) => {
  try {
    const [farmers] = await db.query(
      'SELECT id FROM farmers WHERE user_id = ?',
      [req.user.id]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin nông dân'
      });
    }

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.farmer_id = ? 
       ORDER BY p.created_at DESC`,
      [farmers[0].id]
    );

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Thêm sản phẩm mới
router.post('/', authMiddleware, roleMiddleware('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { name, category_id, quantity, harvest_date, description, price, unit, origin } = req.body;

    // Lấy farmer_id
    const [farmers] = await db.query(
      'SELECT id FROM farmers WHERE user_id = ?',
      [req.user.id]
    );

    if (farmers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin nông dân'
      });
    }

    const farmer_id = farmers[0].id;

    // Tạo mã sản phẩm unique
    const product_code = `DL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Upload image URL
    let image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image_url && req.body.image_base64) {
      try {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const base64Input = req.body.image_base64;
        const imageName = req.body.image_name || `product_${Date.now()}.png`;
        const dataMatch = base64Input.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
        const base64Data = dataMatch ? dataMatch[2] : base64Input;
        let extension = path.extname(imageName);

        if (!extension && dataMatch) {
          const mimeParts = dataMatch[1].split('/');
          extension = mimeParts[1] ? `.${mimeParts[1]}` : '.png';
        }

        if (!extension) {
          extension = '.png';
        }

        const fileName = `base64_${Date.now()}_${Math.round(Math.random() * 1e9)}${extension}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
        image_url = `/uploads/${fileName}`;
      } catch (err) {
        console.error('Base64 image error:', err);
        return res.status(400).json({
          success: false,
          message: 'Ảnh tải lên không hợp lệ'
        });
      }
    }

    // Insert product
    const [result] = await db.query(
      `INSERT INTO products 
       (farmer_id, category_id, product_code, name, quantity, harvest_date, description, price, unit, origin, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [farmer_id, category_id, product_code, name, quantity || 0, harvest_date, description, price, unit, origin, image_url]
    );

    // Tạo QR code (link công khai cho người không dùng app)
    const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:8100';
    const qrCodeData = `${frontendBaseUrl}/trace/${product_code}`;

    const qrCodePath = `uploads/qr_${product_code}.png`;
    await QRCode.toFile(qrCodePath, qrCodeData);

    // Update QR code URL
    await db.query(
      'UPDATE products SET qr_code_url = ? WHERE id = ?',
      [`/${qrCodePath}`, result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm sản phẩm thành công',
      data: {
        id: result.insertId,
        product_code,
        qr_code_url: `/${qrCodePath}`
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Lấy chi tiết sản phẩm theo mã QR
router.get('/trace/:product_code', async (req, res) => {
  try {
    const { product_code } = req.params;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, f.farm_name, f.farm_address, f.district, f.certifications as farm_certifications,
       u.full_name as farmer_name, u.phone as farmer_phone
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN farmers f ON p.farmer_id = f.id
       LEFT JOIN users u ON f.user_id = u.id
       WHERE p.product_code = ?`,
      [product_code]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Lấy lịch sử canh tác
    const [history] = await db.query(
      'SELECT * FROM farming_history WHERE product_id = ? ORDER BY activity_date DESC',
      [products[0].id]
    );

    // Lưu lịch sử quét QR
    await db.query(
      'INSERT INTO scan_history (product_id, ip_address) VALUES (?, ?)',
      [products[0].id, req.ip]
    );

    res.json({
      success: true,
      data: {
        product: products[0],
        farming_history: history
      }
    });
  } catch (error) {
    console.error('Trace product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Cập nhật sản phẩm
router.put('/:id', authMiddleware, roleMiddleware('farmer'), upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, quantity, harvest_date, description, cultivation_method, certifications, status } = req.body;

    // Kiểm tra quyền sở hữu
    const [farmers] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
    const [products] = await db.query('SELECT * FROM products WHERE id = ? AND farmer_id = ?', [id, farmers[0].id]);

    if (products.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền chỉnh sửa sản phẩm này'
      });
    }

    let image_url = products[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      `UPDATE products SET name=?, category_id=?, quantity=?, harvest_date=?, description=?, 
       cultivation_method=?, certifications=?, image_url=?, status=? WHERE id=?`,
      [name, category_id, quantity, harvest_date, description, cultivation_method, certifications, image_url, status, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Xóa sản phẩm
router.delete('/:id', authMiddleware, roleMiddleware('farmer'), async (req, res) => {
  try {
    const { id } = req.params;

    const [farmers] = await db.query('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
    const [products] = await db.query('SELECT * FROM products WHERE id = ? AND farmer_id = ?', [id, farmers[0].id]);

    if (products.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa sản phẩm này'
      });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, f.farm_name, u.full_name as farmer_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN farmers f ON p.farmer_id = f.id
       LEFT JOIN users u ON f.user_id = u.id
       WHERE p.name LIKE ? OR f.farm_name LIKE ? OR p.product_code LIKE ?
       AND p.status = 'available'
       ORDER BY p.created_at DESC
       LIMIT 50`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Lấy chi tiết sản phẩm theo ID (PHẢI ĐẶT CUỐI CÙNG vì /:id sẽ match mọi route)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      `SELECT p.*, c.name as category_name, 
       f.farm_name, f.farm_address, f.district, f.certifications as farm_certifications,
       u.full_name as farmer_name, u.phone as farmer_phone
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN farmers f ON p.farmer_id = f.id
       LEFT JOIN users u ON f.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Lấy lịch sử canh tác nếu có
    const [history] = await db.query(
      'SELECT * FROM farming_history WHERE product_id = ? ORDER BY activity_date DESC',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...products[0],
        farming_history: history
      }
    });
  } catch (error) {
    console.error('Get product detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;
