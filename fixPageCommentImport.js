const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'frontend', 'src', 'app', 'page', '[slug]', 'page.tsx');

let content = fs.readFileSync(pagePath, 'utf8');

// Import satırını değiştir
content = content.replace(
  /import CommentSection from ['"].*CommentSection['"];/,
  `import AdvancedCommentSection from '../../../../components/comments/AdvancedCommentSection';`
);

// JSX içindeki bileşen kullanımını değiştir
content = content.replace(
  /<CommentSection pageId={slug} \/>/,
  `<AdvancedCommentSection pageId={slug} />`
);

fs.writeFileSync(pagePath, content, 'utf8');
console.log(`page.tsx dosyasındaki yorum bileşeni güncellendi: ${pagePath}`);
