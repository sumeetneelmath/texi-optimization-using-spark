@echo off
echo ================================
echo   Taxi Trip Optimizer Setup
echo ================================
echo.

echo [1/4] Setting up backend...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Backend setup complete!
echo.

cd ..

echo [3/4] Setting up frontend...
cd frontend

if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)

echo.
echo [4/4] Frontend setup complete!
echo.

cd ..

echo ================================
echo   Setup Complete!
echo ================================
echo.
echo To start the application:
echo   1. Run: start-backend.bat
echo   2. Run: start-frontend.bat
echo   3. Open http://localhost:3000
echo.
pause
