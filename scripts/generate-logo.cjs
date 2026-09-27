const opentype = require('opentype.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const fontPath = path.resolve(__dirname, '../tmp/Montserrat-BlackItalic.ttf');
const buffer = fs.readFileSync(fontPath);
const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));

const fontSize = 48;
let currentX = 22;
const baseY = 50;
const tracking = -1.8;
const text = 'SportyBet';
let fullPath = '';

for (let i = 0; i < text.length; i++) {
  const glyph = font.charToGlyph(text[i]);
  const p = glyph.getPath(currentX, baseY, fontSize);
  fullPath += p.toPathData(2) + ' ';
  currentX += (glyph.advanceWidth / font.unitsPerEm) * fontSize + tracking;
}

const sGlyph = font.charToGlyph('S');
const sPath = sGlyph.getPath(22, baseY, fontSize);
const sBox = sPath.getBoundingBox();

// Top dot: at top-right of S
const dot1X = sBox.x2 - 1.5;
const dot1Y = sBox.y1 + 4.5;
// Bottom dot: at bottom-left of S
const dot2X = sBox.x1 - 3.5;
const dot2Y = sBox.y2 - 2.5;
const dotRadius = 4.0;

const totalWidth = Math.ceil(currentX + 10);
const totalHeight = 66;

function createSvg(textColor, bgColor = null) {
  const bg = bgColor ? `<rect width="100%" height="100%" fill="${bgColor}" rx="4"/>` : '';
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  ${bg}
  <circle cx="${dot1X.toFixed(1)}" cy="${dot1Y.toFixed(1)}" r="${dotRadius}" fill="${textColor}"/>
  <circle cx="${dot2X.toFixed(1)}" cy="${dot2Y.toFixed(1)}" r="${dotRadius}" fill="${textColor}"/>
  <path d="${fullPath.trim()}" fill="${textColor}"/>
</svg>
`.trim();
}

async function generateAll() {
  const publicDir = path.resolve(__dirname, '../public');
  const androidDir = path.resolve(__dirname, '../android/app/src/main/assets/public');
  
  const whiteSvg = createSvg('#ffffff', null);
  const bannerSvg = createSvg('#ffffff', '#de1a22');
  const redSvg = createSvg('#de1a22', null);
  
  fs.writeFileSync(path.join(publicDir, 'sportybet_logo.svg'), whiteSvg);
  fs.writeFileSync(path.join(publicDir, 'sportybet_logo_banner.svg'), bannerSvg);
  fs.writeFileSync(path.join(publicDir, 'sportybet_logo_red.svg'), redSvg);
  
  if (fs.existsSync(androidDir)) {
    fs.writeFileSync(path.join(androidDir, 'sportybet_logo.svg'), whiteSvg);
    fs.writeFileSync(path.join(androidDir, 'sportybet_logo_banner.svg'), bannerSvg);
    fs.writeFileSync(path.join(androidDir, 'sportybet_logo_red.svg'), redSvg);
  }
  
  const renderPng = async (svg, outFile) => {
    await sharp(Buffer.from(svg))
      .resize(totalWidth * 2, totalHeight * 2)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outFile);
  };
  
  await renderPng(whiteSvg, path.join(publicDir, 'sportybet_logo.png'));
  await renderPng(bannerSvg, path.join(publicDir, 'sportybet_logo_banner.png'));
  await renderPng(redSvg, path.join(publicDir, 'sportybet_logo_red.png'));
  
  if (fs.existsSync(androidDir)) {
    await renderPng(whiteSvg, path.join(androidDir, 'sportybet_logo.png'));
    await renderPng(bannerSvg, path.join(androidDir, 'sportybet_logo_banner.png'));
    await renderPng(redSvg, path.join(androidDir, 'sportybet_logo_red.png'));
  }
  
  console.log('Successfully generated all SportyBet logos with exact geometry!');
}

generateAll().catch(console.error);
