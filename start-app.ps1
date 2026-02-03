# Script để chạy Backend và Frontend cùng lúc

Write-Host "🌿 Starting Traceability Application..." -ForegroundColor Green
Write-Host ""

# Kiểm tra Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
node --version

# Start Backend
Write-Host ""
Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'backend'; npm run dev"

# Đợi 3 giây
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "📱 Starting Ionic Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ionic serve"

Write-Host ""
Write-Host "✅ Application Started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:8100" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
