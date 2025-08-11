const fs = require('fs');
const path = require('path');

function listDirRecursive(dir, indent = '') {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach(item => {
    if (item.isDirectory()) {
      console.log(`${indent}${item.name}/`);
      listDirRecursive(path.join(dir, item.name), indent + '  ');
    } else {
      console.log(`${indent}${item.name}`);
    }
  });
}

// Sadece api klasörünü listele
listDirRecursive('./src/pages');