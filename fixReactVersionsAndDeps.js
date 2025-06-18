const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function updateReactVersion(dir, version) {
  const pkgPath = path.join(dir, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.warn(`package.json bulunamadı: ${pkgPath}`);
    return;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  console.log(`React ve ReactDOM sürümü ${version} olarak güncelleniyor: ${pkgPath}`);
  pkg.dependencies = pkg.dependencies || {};
  pkg.dependencies.react = version;
  pkg.dependencies['react-dom'] = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log(`package.json güncellendi: ${pkgPath}`);
}

function cleanAndInstall(dir) {
  try {
    console.log(`\n${dir} içindeki node_modules ve package-lock.json siliniyor...`);
    execSync(`rd /s /q "${path.join(dir, 'node_modules')}"`, { stdio: 'inherit', shell: true });
  } catch {
    console.log(`node_modules zaten yok veya silinemedi: ${dir}`);
  }
  try {
    execSync(`del /f /q "${path.join(dir, 'package-lock.json')}"`, { stdio: 'inherit', shell: true });
  } catch {
    console.log(`package-lock.json yok veya silinemedi: ${dir}`);
  }
  try {
    console.log(`${dir} içinde npm install --legacy-peer-deps çalıştırılıyor...`);
    execSync('npm install --legacy-peer-deps', { cwd: dir, stdio: 'inherit', shell: true });
  } catch (e) {
    console.error(`npm install başarısız oldu: ${dir}`, e);
    process.exit(1);
  }
}

const projectRoot = process.cwd();
const frontendDir = path.join(projectRoot, 'frontend');
const studioDir = path.join(projectRoot, 'studio');

updateReactVersion(frontendDir, '^18.2.0');
updateReactVersion(studioDir, '^17.0.2');

cleanAndInstall(frontendDir);
cleanAndInstall(studioDir);

console.log('\nİşlem tamamlandı. Şimdi frontend ve studio uygulamalarını test edebilirsin.');
