import jwt from 'jsonwebtoken';
import { query } from '../configuracao/bancoDados.js';

const DEMO_EMAILS = {
  cliente: 'demo.cliente@fideli.com',
  dono: 'demo.dono@fideli.com',
};

export async function demoLogin(req, res) {
  const { role } = req.body;

  if (!DEMO_EMAILS[role]) {
    return res.status(400).json({ error: 'role deve ser "cliente" ou "dono"' });
  }

  const { rows } = await query('SELECT id, cpf, celular, email, role, nome FROM users WHERE email = $1', [
    DEMO_EMAILS[role],
  ]);

  const user = rows[0];
  if (!user) {
    return res.status(500).json({ error: 'Usuário demo não encontrado — rode "npm run migrar" no server' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, nome: user.nome }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({ token, user });
}

export async function me(req, res) {
  const { rows } = await query('SELECT id, cpf, celular, email, role, nome FROM users WHERE id = $1', [
    req.user.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(rows[0]);
}
