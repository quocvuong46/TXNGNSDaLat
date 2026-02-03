const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging (for debugging mobile login/register)
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log('➡️', req.method, req.url);
    if (Object.keys(req.body || {}).length > 0) {
      console.log('📦 Body:', req.body);
    }
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Traceability API - Nông sản Đà Lạt',
    version: '1.0.0'
  });
});

// API health route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Traceability API is running',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Có lỗi xảy ra'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy đường dẫn'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📱 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🌿 Traceability System - Nông sản Đà Lạt`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} đang được sử dụng. Hãy dừng process khác hoặc đổi port.`);
  } else {
    console.error('❌ Lỗi server:', error);
  }
  process.exit(1);
});
