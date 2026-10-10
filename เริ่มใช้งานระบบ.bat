@echo off
chcp 65001 >nul
echo ========================================================
echo    ระบบบริหารงานวิชาการโรงเรียนฝันใหม่ (เวอร์ชัน fm)
echo    พัฒนาโดย: funmai studio
echo    Email: attapon@nbcc.ac.th ^| โทร. 062-3636031
echo ========================================================
echo.
echo กำลังเริ่มต้นเซิร์ฟเวอร์ระบบวิชาการ โรงเรียนฝันใหม่...
cd /d "%~dp0"
start http://localhost:3000
node server.js
pause
