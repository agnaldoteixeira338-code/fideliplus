import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2];

if (!url) {
  console.error('Uso: npm run qrcode -- https://seu-site.onrender.com');
  process.exit(1);
}

const pastaSaida = path.join(__dirname, '..', '..', 'acesso rapido');
fs.mkdirSync(pastaSaida, { recursive: true });

const destino = path.join(pastaSaida, 'QRCode-Apresentacao.png');

await QRCode.toFile(destino, url, {
  width: 800,
  margin: 2,
  color: { dark: '#7a0619', light: '#ffffff' },
});

console.log(`[qrcode] gerado em: ${destino}`);
console.log(`[qrcode] apontando para: ${url}`);
