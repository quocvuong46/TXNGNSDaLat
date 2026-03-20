// Generate QR PNGs for mock product codes
// Usage: node tools/generate-qr.js

const path = require('path');
const fs = require('fs/promises');
const QRCode = require('qrcode');

const baseCodes = [
  { text: 'QR-DAUTAY-001', label: 'Dâu tây Đà Lạt' },
  { text: 'QR-ATISO-002', label: 'Atiso tím' },
  { text: 'QR-CACHUABI-003', label: 'Cà chua bi sấy lạnh' },
  { text: 'QR-RAUCU-004', label: 'Rau củ mix' }
];

function buildCodes(total = 50) {
  const codes = baseCodes.map((c) => ({ ...c, file: `${c.text.toLowerCase()}.png` }));

  for (let i = codes.length + 1; i <= total; i++) {
    const code = `QR-PROD-${String(i).padStart(3, '0')}`;
    codes.push({ text: code, label: `Sản phẩm mock #${i}`, file: `${code.toLowerCase()}.png` });
  }

  return codes;
}

async function main() {
  const outDir = path.join(__dirname, '..', 'src', 'assets', 'qr');
  await fs.mkdir(outDir, { recursive: true });
  const codes = buildCodes(50);
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
