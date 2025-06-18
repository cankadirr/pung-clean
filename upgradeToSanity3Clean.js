const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const studioDir = path.join(process.cwd(), 'studio');
const packageJsonPath = path.join(studioDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('studio/package.json bulunamadı!');
  process.exit(1);
}

// Yeni package.json içeriği
const newPackageJson = {
  name: "studio",
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "sanity dev",
    build: "sanity build",
    start: "sanity start"
  },
  dependencies: {
    sanity: "^3.93.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0"
  },
  engines: {
    node: ">=16"
  }
};

// package.json'u güncelle
fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2), 'utf8');
console.log('studio/package.json, Sanity 3 ve React 18 uyumlu olarak güncellendi.');

// node_modules ve package-lock.json temizle
try {
  console.log('studio/node_modules ve package-lock.json siliniyor...');
  execSync(`rd /s /q "${path.join(studioDir, 'node_modules')}"`, { stdio: 'inherit', shell: true });
  execSync(`del /f /q "${path.join(studioDir, 'package-lock.json')}"`, { stdio: 'inherit', shell: true });
} catch {
  console.log('Dosyalar zaten temiz veya silinemedi.');
}

// bağımlılıkları yükle
try {
  console.log('studio klasöründe npm install --legacy-peer-deps çalıştırılıyor...');
  execSync('npm install --legacy-peer-deps', { cwd: studioDir, stdio: 'inherit', shell: true });
} catch (e) {
  console.error('npm install sırasında hata oluştu:', e);
  process.exit(1);
}

console.log('Sanity 3 yükseltme ve React 18 kurulumu tamamlandı!');
