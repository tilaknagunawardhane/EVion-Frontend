@echo off
echo Starting React Native with memory optimizations...

rem Set Node.js memory options
set NODE_OPTIONS=--max-old-space-size=4096 --max-semi-space-size=256

rem Change to project directory
cd /d "c:\xampp\htdocs\EVion-Frontend-main\EVion-Frontend"

rem Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

rem Clear Metro cache and start with optimizations
echo Clearing Metro cache and starting...
npx expo start --clear --max-workers 2

echo React Native started with memory optimizations!
