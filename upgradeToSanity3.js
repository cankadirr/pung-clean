const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const studioDir = path.join(process.cwd(), 'studio');
const packageJsonPath = path.join(studioDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('studio/package.json bulunamadı!');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Sanity paketlerini 3.x sürümlerine güncelle
const sanityPackages = [
  '@sanity/base',
  '@sanity/desk-tool',
  '@sanity/form-builder',
  '@sanity/vision',
  'sanity'
];

sanityPackages.forEach(pkgName => {
  if (pkg.dependencies && pkg.dependencies[pkgName]) {
    pkg.dependencies[pkgName] = '^3.0.0';
    console.log(`${pkgName} sürümü 3.x olarak güncellendi.`);
  }
});

// React sürümlerini 18.2.0 yap
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['react'] = '^18.2.0';
pkg.dependencies['react-dom'] = '^18.2.0';

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('package.json güncellendi.');

// node_modules ve package-lock.json temizle
try {
  console.log('node_modules ve package-lock.json siliniyor...');
  execSync(`rd /s /q "${path.join(studioDir, 'node_modules')}"`, { stdio: 'inherit', shell: true });
  execSync(`del /f /q "${path.join(studioDir, 'package-lock.json')}"`, { stdio: 'inherit', shell: true });
} catch {
  console.log('Dosyalar zaten temiz veya silinemedi.');
}

// npm install --legacy-peer-deps çalıştır
try {
  console.log('npm install --legacy-peer-deps çalıştırılıyor...');
  execSync('npm install --legacy-peer-deps', { cwd: studioDir, stdio: 'inherit', shell: true });
} catch (e) {
  console.error('npm install sırasında hata oluştu:', e);
  process.exit(1);
}

console.log('Sanity 3 yükseltme işlemi tamamlandı. Artık studio klasöründe React 18 ile çalışabilirsin.');
