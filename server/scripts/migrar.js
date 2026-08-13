import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/configuracao/bancoDados.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '..', 'src', 'migracoes');

async function run() {
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`[migrar] aplicando ${file}...`);
    await pool.query(sql);
  }

  console.log('[migrar] concluído.');
  await pool.end();
}

run().catch((err) => {
  console.error('[migrar] falhou:', err);
  process.exit(1);
});
