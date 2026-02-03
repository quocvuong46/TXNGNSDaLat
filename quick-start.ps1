# Quick Start Script - Chạy trực tiếp trong terminal hiện tại

Write-Host "=====================================" -ForegroundColor Green
Write-Host "   TRACEABILITY APP - QUICK START    " -ForegroundColor Green  
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Hướng dẫn
Write-Host "HƯỚNG DẪN NHANH:" -ForegroundColor Yellow
Write-Host "1. Mở Terminal 1 - Chạy Backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Mở Terminal 2 - Chạy Frontend:" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host "   ionic serve" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Tạo Database MySQL:" -ForegroundColor White
Write-Host "   mysql -u root -p < backend/config/database.sql" -ForegroundColor Cyan
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "Backend sẽ chạy tại: http://localhost:3000" -ForegroundColor Magenta
Write-Host "Frontend sẽ chạy tại: http://localhost:8100" -ForegroundColor Magenta
Write-Host "=====================================" -ForegroundColor Green
