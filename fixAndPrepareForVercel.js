const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function updateReactVersion(dir, reactVersion) {
  const packageJsonPath = path.join(dir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.warn(`package.json bulunamadı: ${packageJsonPath}`);
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`React ve ReactDOM sürümleri ${reactVersion} olarak güncelleniyor: ${packageJsonPath}`);
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies['react'] = reactVersion;
  packageJson.dependencies['react-dom'] = reactVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log(`package.json güncellendi: ${packageJsonPath}`);
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

console.log('\nReact sürümleri güncellendi ve bağımlılıklar temiz kuruldu.');
console.log('Şimdi frontend ve studio uygulamalarını çalıştırabilirsin:');
console.log('Frontend için: npm run dev --prefix frontend');
console.log('Studio için: npm run dev --prefix studio');
