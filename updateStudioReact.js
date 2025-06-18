const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const studioDir = path.join(process.cwd(), 'studio');
const packageJsonPath = path.join(studioDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('studio/package.json bulunamadı!');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.dependencies = packageJson.dependencies || {};
packageJson.dependencies['react'] = '^18.0.0';
packageJson.dependencies['react-dom'] = '^18.0.0';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('studio/package.json içindeki React sürümleri 18 olarak güncellendi.');

try {
  console.log('studio içinde node_modules ve package-lock.json siliniyor...');
  execSync(`rd /s /q "${path.join(studioDir, 'node_modules')}"`, { stdio: 'inherit', shell: true });
  execSync(`del /f /q "${path.join(studioDir, 'package-lock.json')}"`, { stdio: 'inherit', shell: true });
} catch {
  console.log('Dosyalar zaten silinmiş olabilir.');
}

console.log('studio içinde npm install --legacy-peer-deps çalıştırılıyor...');
execSync('npm install --legacy-peer-deps', { cwd: studioDir, stdio: 'inherit', shell: true });

console.log('İşlem tamamlandı! studio klasöründeki React 18 sürümü ile güncellenip bağımlılıklar tekrar kuruldu.');
