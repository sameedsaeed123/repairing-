const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function updatePngReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace .png with .jpg in image references
  content = content.replace(/(['"`])([^'"]*?)\.png(['"`])/g, '$1$2.jpg$3');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(__dirname, filePath)}`);
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      if (updatePngReferences(fullPath)) {
        count++;
      }
    }
  });
  
  return count;
}

console.log('Updating .png references to .jpg...\n');
const count = processDirectory(srcDir);
console.log(`\n✅ Updated ${count} files`);
