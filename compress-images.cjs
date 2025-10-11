const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const backupDir = path.join(__dirname, 'public-backup');

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
  console.log('Created backup directory');
}

async function compressImage(inputPath, maxWidth = 1920, quality = 80) {
  try {
    const fileName = path.basename(inputPath);
    const backupPath = path.join(backupDir, fileName);
    
    // Create backup
    fs.copyFileSync(inputPath, backupPath);
    
    // Get original size
    const originalSize = fs.statSync(inputPath).size;
    
    // Compress image
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.jpg');
    
    await sharp(inputPath)
      .resize(maxWidth, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath + '.tmp');
    
    // Replace original
    fs.renameSync(outputPath + '.tmp', outputPath);
    
    // Delete original PNG if converted to JPG
    if (outputPath !== inputPath) {
      fs.unlinkSync(inputPath);
    }
    
    const compressedSize = fs.statSync(outputPath).size;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    console.log(`✓ ${fileName}`);
    console.log(`  ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);
    
    return { originalSize, compressedSize };
  } catch (error) {
    console.error(`✗ Error: ${path.basename(inputPath)} - ${error.message}`);
    return null;
  }
}

async function compressAllImages() {
  const files = fs.readdirSync(publicDir);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );
  
  console.log(`\nFound ${imageFiles.length} images to compress...\n`);
  
  let totalOriginal = 0;
  let totalCompressed = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(publicDir, file);
    const result = await compressImage(inputPath);
    
    if (result) {
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
    }
  }
  
  console.log('\n====================================');
  console.log('✅ Compression Complete!');
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalCompressed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Saved: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(2)}%`);
  console.log(`📁 Backup: ${backupDir}`);
}

compressAllImages().catch(console.error);
