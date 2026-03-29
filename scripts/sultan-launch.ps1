# Wazone Sultan's Master Launch Script 🚀

Write-Host "--- WAZONE SAAS COMMAND CENTER INITIATED ---" -ForegroundColor Cyan

# 1. Ensure Docker is purring
Write-Host "[1/3] Starting Docker Engines..." -ForegroundColor Yellow
pnpm run dev:docker

# 2. Apply the Sultan's Laws (Migrations)
Write-Host "[2/3] Syncing Database Schemas (Trial, Configs, Payments)..." -ForegroundColor Yellow
pnpm run db:migrate

# 3. Ignite the SaaS Portal
Write-Host "[3/3] Launching Wazone Frontend..." -ForegroundColor Green
Write-Host "Access your empire at: http://localhost:3010" -ForegroundColor Cyan
pnpm run dev:next
