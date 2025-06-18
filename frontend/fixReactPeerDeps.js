const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const projectRoot = __dirname;
const packageJsonPath = path.join(projectRoot, 'package.json');

function updateReactVersion() {
  if (!fs.existsSync(packageJsonPath)) {
    console.error('package.json dosyası bulunamadı!');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  console.log('React ve ReactDOM sürümleri güncelleniyor...');

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies['react'] = '^17.0.2';
  packageJson.dependencies['react-dom'] = '^17.0.2';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('package.json güncellendi.');
}

function cleanInstall() {
  try {
    console.log('node_modules ve package-lock.json dosyaları siliniyor...');
    execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
  } catch {
    console.log('Windows ortamında çalışıyorsanız node_modules ve package-lock.json dosyalarını manuel silin.');
  }

  try {
    console.log('npm install --legacy-peer-deps çalıştırılıyor...');
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  } catch (e) {
    console.error('npm install işlemi başarısız oldu:', e);
    process.exit(1);
  }
}

updateReactVersion();
cleanInstall();

console.log('React versiyon uyuşmazlığı giderildi, bağımlılıklar yeniden yüklendi.');
