Write-Host "Öncelikle frontend klasöründe temizlik ve kurulum yapılıyor..."

Set-Location -Path ".\frontend"

if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
    Write-Host "frontend\node_modules silindi."
} else {
    Write-Host "frontend\node_modules yok."
}

if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
    Write-Host "frontend\package-lock.json silindi."
} else {
    Write-Host "frontend\package-lock.json yok."
}

Write-Host "frontend npm install --legacy-peer-deps çalıştırılıyor..."
npm install --legacy-peer-deps

Write-Host "`nŞimdi studio klasöründe temizlik ve kurulum..."

Set-Location -Path "..\studio"

if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
    Write-Host "studio\node_modules silindi."
} else {
    Write-Host "studio\node_modules yok."
}

if (Test-Path package-lock.json) {
    Remove-Item -Force package-lock.json
    Write-Host "studio\package-lock.json silindi."
} else {
    Write-Host "studio\package-lock.json yok."
}

Write-Host "studio npm install --legacy-peer-deps çalıştırılıyor..."
npm install --legacy-peer-deps

Write-Host "`nİşlem tamamlandı. Projeyi başlatabilirsiniz."
