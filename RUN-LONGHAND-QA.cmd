@echo off
setlocal EnableExtensions
cd /d "%~dp0"
set "REPORT=%~dp0LONGHAND-QA-RESULTS.txt"
> "%REPORT%" echo LONGHAND - OFFLINE BROWSER QA
>> "%REPORT%" echo Run date: %DATE% %TIME%
>> "%REPORT%" echo No gameplay edits, GitHub Actions, merge, or deployment.
where node >nul 2>&1
if errorlevel 1 goto :no_node
where npm >nul 2>&1
if errorlevel 1 goto :no_npm
echo Installing local browser test package...
call npm install --no-save --no-package-lock --no-audit --no-fund playwright@1.56.1 >> "%REPORT%" 2>&1
if errorlevel 1 goto :fail
echo Installing Chromium for local testing...
call npx playwright install chromium >> "%REPORT%" 2>&1
if errorlevel 1 goto :fail
echo Running offline game checks...
node tools\qa-browser.js >> "%REPORT%" 2>&1
if errorlevel 1 goto :fail
>> "%REPORT%" echo RESULT: ALL AUTOMATED QA STAGES PASSED.
echo PASS - upload LONGHAND-QA-RESULTS.txt to ChatGPT.
pause
exit /b 0
:no_node
>> "%REPORT%" echo FAIL: Node.js not installed.
goto :fail
:no_npm
>> "%REPORT%" echo FAIL: npm not installed.
:fail
>> "%REPORT%" echo RESULT: FAIL. Inspect the errors above.
echo FAIL - upload LONGHAND-QA-RESULTS.txt to ChatGPT.
pause
exit /b 1
