// Generate QR PNGs for mock product codes
// Usage: node tools/generate-qr.js

const path = require('path');
const fs = require('fs/promises');
const QRCode = require('qrcode');

const codes = [
  { text: 'QR-DAUTAY-001', file: 'qr-dautay-001.png', label: 'Dâu tây Đà Lạt' },
  { text: 'QR-ATISO-002', file: 'qr-atiso-002.png', label: 'Atiso tím' },
  { text: 'QR-CACHUABI-003', file: 'qr-cachua-003.png', label: 'Cà chua bi sấy lạnh' },
  { text: 'QR-RAUCU-004', file: 'qr-raucu-004.png', label: 'Rau củ mix' }
];

async function main() {
  const outDir = path.join(__dirname, '..', 'src', 'assets', 'qr');
  await fs.mkdir(outDir, { recursive: true });
  for (const code of codes) {
    const outPath = path.join(outDir, code.file);
    await QRCode.toFile(outPath, code.text, {
      errorCorrectionLevel: 'H',
      margin: 2,
      scale: 8
    });
    console.log('Created', outPath, '-', code.text, code.label);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
