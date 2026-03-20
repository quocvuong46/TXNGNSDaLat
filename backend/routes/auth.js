const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { OAuth2Client } = require('google-auth-library');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

// Đăng ký
router.post('/register', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('full_name').notEmpty().withMessage('Họ tên không được để trống')
], async (req, res) => {
  try {
    // Log request body for debugging
    console.log('📝 Register request body:', req.body);
    
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

  const { email, password, full_name, phone } = req.body;
  const role = 'customer';

    // Kiểm tra email đã tồn tại
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password, full_name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, full_name, phone, role]
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        id: result.insertId,
        email,
        full_name,
        role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// Đăng nhập
router.post('/login', [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu không được để trống')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Tìm user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = users[0];

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Lấy thông tin farmer nếu role là farmer
    let farmerInfo = null;
    if (user.role === 'farmer') {
      const [farmers] = await db.query(
        'SELECT * FROM farmers WHERE user_id = ?',
        [user.id]
      );
      farmerInfo = farmers[0] || null;
    }

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          farmer: farmerInfo
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;

// Đăng nhập Google
router.post('/google-login', [
  body('id_token').notEmpty().withMessage('Thiếu id_token Google')
], async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ success: false, message: 'Chưa cấu hình GOOGLE_CLIENT_ID' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id_token } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    const email = payload?.email;
    const fullName = payload?.name || email;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Không lấy được email từ Google' });
    }

    let user;
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      user = existing[0];
    } else {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const [result] = await db.query(
        'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, fullName || email, 'customer']
      );
      user = { id: result.insertId, email, full_name: fullName, role: 'customer' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Đăng nhập Google thành công',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name || fullName,
          role: user.role,
          avatar: payload?.picture
        }
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ success: false, message: 'Đăng nhập Google thất bại' });
  }
});

// Đăng nhập Facebook
router.post('/facebook-login', [
  body('access_token').notEmpty().withMessage('Thiếu access_token Facebook')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { access_token } = req.body;
    const fbResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`);
    const profile = await fbResponse.json();

    if (profile.error) {
      return res.status(400).json({ success: false, message: profile.error.message || 'Không lấy được thông tin Facebook' });
    }

    const email = profile.email || `${profile.id}@facebook.local`;
    const fullName = profile.name || 'Facebook User';

    let user;
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      user = existing[0];
    } else {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const [result] = await db.query(
        'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, fullName, 'customer']
      );
      user = { id: result.insertId, email, full_name: fullName, role: 'customer' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Đăng nhập Facebook thành công',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name || fullName,
          role: user.role,
          avatar: profile?.picture?.data?.url
        }
      }
    });
  } catch (error) {
    console.error('Facebook login error:', error);
    res.status(500).json({ success: false, message: 'Đăng nhập Facebook thất bại' });
  }
});
