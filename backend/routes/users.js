const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Lấy thông tin user
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, full_name, phone, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    let profile = users[0];

    // Nếu là farmer, lấy thông tin farm
    if (profile.role === 'farmer') {
      const [farmers] = await db.query(
        'SELECT * FROM farmers WHERE user_id = ?',
        [req.user.id]
      );
      profile.farmer = farmers[0] || null;
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Cập nhật thông tin user
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, phone, farm_name, farm_address, district, certifications } = req.body;

    await db.query(
      'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
      [full_name, phone, req.user.id]
    );

    // Nếu là farmer, cập nhật thông tin farm
    if (req.user.role === 'farmer') {
      await db.query(
        `UPDATE farmers SET farm_name = ?, farm_address = ?, district = ?, certifications = ? 
         WHERE user_id = ?`,
        [farm_name, farm_address, district, certifications, req.user.id]
      );
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Lấy danh sách yêu thích
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const [favorites] = await db.query(
      `SELECT p.*, c.name as category_name, f.farm_name
       FROM favorites fav
       JOIN products p ON fav.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN farmers f ON p.farmer_id = f.id
       WHERE fav.user_id = ?
       ORDER BY fav.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Thêm/xóa yêu thích
router.post('/favorites/:product_id', authMiddleware, async (req, res) => {
  try {
    const { product_id } = req.params;

    const [existing] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [req.user.id, product_id]
    );

    if (existing.length > 0) {
      // Xóa khỏi danh sách yêu thích
      await db.query(
        'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
        [req.user.id, product_id]
      );
      return res.json({
        success: true,
        message: 'Đã xóa khỏi danh sách yêu thích'
      });
    } else {
      // Thêm vào danh sách yêu thích
      await db.query(
        'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)',
        [req.user.id, product_id]
      );
      return res.json({
        success: true,
        message: 'Đã thêm vào danh sách yêu thích'
      });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;
