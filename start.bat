@echo off
setlocal
cd /d "%~dp0"
py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
if errorlevel 1 goto python_required
if not exist ".venv\Scripts\python.exe" (
  py -3 -m venv .venv
  if errorlevel 1 goto failed
)
".venv\Scripts\python.exe" -c "import sys; sys.exit(0 if sys.version_info >= (3, 11) else 1)" >nul 2>&1
if errorlevel 1 goto stale_environment
".venv\Scripts\python.exe" -c "import PIL; version = tuple(map(int, PIL.__version__.split('.')[:2])); assert (10, 4) <= version < (13, 0)" >nul 2>&1
if not errorlevel 1 goto run_app
".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 goto failed
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto failed
:run_app
".venv\Scripts\python.exe" -m app.server %*
if errorlevel 1 goto failed
exit /b 0
:python_required
echo Python 3.11 or newer is required. Your selected Python is missing or too old.
echo Install Python 3.11 or newer from python.org, including the Python launcher.
echo Then reopen this file. Run py -3 --version in PowerShell to check.
pause
exit /b 1
:stale_environment
echo This project's .venv was made with an older or unavailable Python.
echo Rename the .venv folder to .venv-old, then run start.bat again.
echo If .venv-old already exists, choose a different backup name.
pause
exit /b 1
:failed
echo Setup or startup failed. Read the message above and see README.md.
pause
exit /b 1
