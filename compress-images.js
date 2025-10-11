const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const publicDir = path.join(__dirname, 'public');
const backupDir = path.join(__dirname, 'public-backup');

// Create backup directory
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

async function compressImage(inputPath, outputPath, maxWidth = 1920, quality = 0.8) {
  try {
    const image = await loadImage(inputPath);
    let width = image.width;
    let height = image.height;

    // Calculate new dimensions
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    // Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality });
    fs.writeFileSync(outputPath, buffer);

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = buffer.length;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    console.log(`✓ ${path.basename(inputPath)}`);
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Saved: ${savings}%\n`);

    return { originalSize, compressedSize };
  } catch (error) {
    console.error(`✗ Error compressing ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

async function compressAllImages() {
  const files = fs.readdirSync(publicDir);
  const imageFiles = files.filter(file => 
    /\.(png|jpg|jpeg)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} images to compress...\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(publicDir, file);
    const backupPath = path.join(backupDir, file);
    
    // Create backup
    fs.copyFileSync(inputPath, backupPath);
    
    // Compress image
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.jpg');
    const result = await compressImage(inputPath, outputPath);
    
    if (result) {
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
      
      // If output is different from input (e.g., PNG -> JPG), remove original
      if (outputPath !== inputPath) {
        fs.unlinkSync(inputPath);
      }
    }
  }

  console.log('====================================');
  console.log('Compression Complete!');
  console.log(`Total original size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total compressed size: ${(totalCompressed / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total saved: ${((1 - totalCompressed / totalOriginal) * 100).toFixed(2)}%`);
  console.log(`\nBackup created in: ${backupDir}`);
}

compressAllImages().catch(console.error);
