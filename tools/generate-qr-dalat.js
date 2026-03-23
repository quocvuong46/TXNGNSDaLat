// Generate 20 QR PNGs for codes dalat-001..dalat-020
// Usage: node tools/generate-qr-dalat.js

const path = require('path');
const fs = require('fs/promises');
const QRCode = require('qrcode');

async function buildCodes(total = 20) {
  const codes = [];
  for (let i = 1; i <= total; i++) {
    const code = `dalat-${String(i).padStart(3, '0')}`;
    codes.push({ text: code, file: `${code}.png` });
  }
  return codes;
}

async function main() {
  const outDir = path.join(__dirname, '..', 'src', 'assets', 'qr', 'dalat');
  await fs.mkdir(outDir, { recursive: true });
  const codes = await buildCodes(20);
  for (const code of codes) {
    const outPath = path.join(outDir, code.file);
    await QRCode.toFile(outPath, code.text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8
    });
    console.log('Created', outPath, '-', code.text);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
