# Test API Đăng ký

Write-Host "========================================" -ForegroundColor Green
Write-Host "  TEST API ĐĂNG KÝ - Traceability" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Test data
$registerData = @{
    email = "farmer1@dalat.com"
    password = "123456"
    full_name = "Nông dân Test 1"
    phone = "0353805659"
    role = "farmer"
} | ConvertTo-Json

Write-Host "Dữ liệu đăng ký:" -ForegroundColor Yellow
Write-Host $registerData
Write-Host ""

try {
    Write-Host "Đang gửi request đến API..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerData
    
    Write-Host "✅ Đăng ký THÀNH CÔNG!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Kết quả:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ Đăng ký THẤT BẠI!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Lỗi:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "Chi tiết lỗi từ server:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Test Login
Write-Host "Bây giờ thử ĐĂNG NHẬP..." -ForegroundColor Cyan
Write-Host ""

$loginData = @{
    email = "farmer1@dalat.com"
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginData
    
    Write-Host "✅ Đăng nhập THÀNH CÔNG!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Token:" -ForegroundColor Yellow
    Write-Host $loginResponse.data.token
    Write-Host ""
    Write-Host "Thông tin user:" -ForegroundColor Yellow
    $loginResponse.data.user | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ Đăng nhập THẤT BẠI!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}
