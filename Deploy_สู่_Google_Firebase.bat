@echo off
title Deploy to Firebase - academic-mis
cd /d "%~dp0"
echo ========================================================
echo   Deploying Academic MIS to Google Firebase
echo   Project: academic-mis
echo ========================================================
echo.
echo [Step 1] Logging in to Firebase...
echo A browser window will open. Select: meenunkaka@gmail.com and click Allow.
echo.
"C:\Program Files\nodejs\node.exe" "C:\Users\funma\AppData\Roaming\npm\node_modules\firebase-tools\lib\bin\firebase.js" login --reauth

echo.
echo ========================================================
echo [Step 2] Deploying site to Firebase Hosting...
echo ========================================================
echo.
"C:\Program Files\nodejs\node.exe" "C:\Users\funma\AppData\Roaming\npm\node_modules\firebase-tools\lib\bin\firebase.js" deploy --only hosting

echo.
echo ========================================================
echo   Complete! Your Web App is live at:
echo   https://academic-mis.web.app
echo ========================================================
echo.
pause
