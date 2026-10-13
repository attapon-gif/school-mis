@echo off
chcp 65001 >nul
echo กำลังคัดลอกโค้ด google-apps-script\Code.gs ลงในคลิปบอร์ด...
powershell -NoProfile -Command "Get-Content -Path '%~dp0google-apps-script\Code.gs' -Raw -Encoding utf8 | Set-Clipboard"
echo ========================================================
echo [สำเร็จ] คัดลอกโค้ด Code.gs ลงในคลิปบอร์ดเรียบร้อยแล้ว!
echo คุณสามารถไปที่หน้า Google Apps Script ใน Google Sheets แล้วกด Ctrl + V เพื่อวางได้ทันที
echo ========================================================
pause
