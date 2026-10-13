@echo off
chcp 65001 >nul
echo กำลังคัดลอกโค้ด google-apps-script\Index.html ลงในคลิปบอร์ด...
powershell -NoProfile -Command "Get-Content -Path '%~dp0google-apps-script\Index.html' -Raw -Encoding utf8 | Set-Clipboard"
echo ========================================================
echo [สำเร็จ] คัดลอกโค้ด Index.html ฉบับสมบูรณ์ลงในคลิปบอร์ดเรียบร้อยแล้ว!
echo คุณสามารถไปที่หน้า Google Apps Script แล้วกด Ctrl + V เพื่อวางได้ทันที
echo ========================================================
pause
