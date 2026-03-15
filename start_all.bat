@echo off
echo Demarrage de PeekSense AeroHacks...
echo.

echo 1. Demarrage du service ML Python (Port 5001)...
start "ML Service" cmd /c "cd /d C:\Users\alici\PeekSense-AeroHacks\python && .venv\Scripts\python.exe ml_service_lite.py"

timeout /t 3 /nobreak >nul

echo 2. Demarrage du backend Node.js (Port 4000)...
if not exist "C:\Users\alici\PeekSense-AeroHacks\drone-monitoring\backend\.env" (
    echo WARNING: Fichier .env manquant ! Consultez API_KEYS_SETUP.md
    timeout /t 2 /nobreak >nul
)
start "Backend" cmd /c "cd /d C:\Users\alici\PeekSense-AeroHacks\drone-monitoring\backend && node index.js"

timeout /t 3 /nobreak >nul

echo 3. Demarrage du frontend React (Port 3000)...
start "Frontend" cmd /c "cd /d C:\Users\alici\PeekSense-AeroHacks\drone-monitoring && npm start"

echo.
echo Tous les services sont en cours de demarrage...
echo - Service ML: http://localhost:5001
echo - Backend API: http://localhost:4000  
echo - Frontend: http://localhost:3000
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul