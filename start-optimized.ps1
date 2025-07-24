#!/usr/bin/env pwsh
# React Native Memory Optimization Startup Script

Write-Host "Starting React Native with memory optimizations..." -ForegroundColor Green

# Set Node.js memory options
$env:NODE_OPTIONS = "--max-old-space-size=4096 --max-semi-space-size=256"

# Change to project directory
Set-Location "c:\xampp\htdocs\EVion-Frontend-main\EVion-Frontend"

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Clear Metro cache if needed
Write-Host "Clearing Metro cache..." -ForegroundColor Yellow
npx expo start --clear --max-workers 2

Write-Host "React Native started with memory optimizations!" -ForegroundColor Green
