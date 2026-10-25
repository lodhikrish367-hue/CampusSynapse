@echo off
echo ========================================================
echo  CAMPUS-SYNAPSE: Smart Project Team Formation System
echo ========================================================
echo.

REM Start Backend Flask Server
echo [1/2] Starting Python Flask Backend on http://127.0.0.1:5000 ...
start "Campus-Synapse Backend" cmd /k "cd backend && venv\Scripts\python.exe app.py"

REM Start Frontend Vite Server
echo [2/2] Starting React Frontend on http://127.0.0.1:5173 ...
start "Campus-Synapse Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Both services launched successfully!
echo  Open your browser at: http://localhost:5173
echo ========================================================
pause

