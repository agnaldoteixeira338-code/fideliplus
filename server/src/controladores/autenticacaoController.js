import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../configuracao/bancoDados.js';

function emitirToken(user) {
  return jwt.sign({ id: user.id, role: user.role, nome: user.nome }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
}

function dadosPublicos(user) {
  return { id: user.id, cpf: user.cpf, celular: user.celular, email: user.email, role: user.role, nome: user.nome };
}

export async function register(req, res) {
  const { cpf, celular, email, senha, confirmarSenha, role, nome } = req.body;

  if (!cpf || !celular || !email || !senha || !confirmarSenha || !role) {
    return res.status(400).json({ error: 'Preencha CPF, celular, e-mail, senha, confirmação de senha e o tipo de conta' });
  }
  if (!['cliente', 'dono'].includes(role)) {
    return res.status(400).json({ error: 'role deve ser "cliente" ou "dono"' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
  }
  if (senha !== confirmarSenha) {
    return res.status(400).json({ error: 'A senha e a confirmação de senha não são iguais' });
  }

  const { rows: existentes } = await query('SELECT id FROM users WHERE cpf = $1 OR email = $2', [cpf, email]);
  if (existentes.length > 0) {
    return res.status(409).json({ error: 'Já existe uma conta com esse CPF ou e-mail' });
  }

  const passwordHash = await bcrypt.hash(senha, 10);

  const { rows } = await query(
    `INSERT INTO users (cpf, celular, email, password_hash, role, nome)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, cpf, celular, email, role, nome`,
    [cpf, celular, email, passwordHash, role, nome || null]
  );

  const user = rows[0];

  if (role === 'dono') {
    await query(
      `INSERT INTO establishments (owner_id, nome, ativo) VALUES ($1, $2, true)`,
      [user.id, 'Meu Estabelecimento']
    );
  }

  res.status(201).json({ token: emitirToken(user), user: dadosPublicos(user) });
}

export async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Informe e-mail e senha' });
  }

  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user || !user.password_hash || !(await bcrypt.compare(senha, user.password_hash))) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos' });
  }

  res.json({ token: emitirToken(user), user: dadosPublicos(user) });
}

export async function recuperarSenhaVerificar(req, res) {
  const { email, celular } = req.body;
  if (!email || !celular) {
    return res.status(400).json({ error: 'Informe e-mail e celular' });
  }

  const { rows } = await query('SELECT id FROM users WHERE email = $1 AND celular = $2', [email, celular]);
  if (!rows[0]) {
    return res.status(404).json({ error: 'Não encontramos nenhuma conta com esse e-mail e celular' });
  }

  const resetToken = jwt.sign({ id: rows[0].id, proposito: 'reset-senha' }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  res.json({ resetToken });
}

export async function recuperarSenhaRedefinir(req, res) {
  const { resetToken, novaSenha, confirmarNovaSenha } = req.body;
  if (!resetToken || !novaSenha || !confirmarNovaSenha) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  if (novaSenha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
  }
  if (novaSenha !== confirmarNovaSenha) {
    return res.status(400).json({ error: 'A senha e a confirmação de senha não são iguais' });
  }

  let payload;
  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Sessão de recuperação expirada, comece novamente' });
  }
  if (payload.proposito !== 'reset-senha') {
    return res.status(401).json({ error: 'Token inválido para esta operação' });
  }

  const passwordHash = await bcrypt.hash(novaSenha, 10);
  const { rows } = await query(
    'UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2 RETURNING id, cpf, celular, email, role, nome',
    [passwordHash, payload.id]
  );

  const user = rows[0];
  res.json({ token: emitirToken(user), user: dadosPublicos(user) });
}

export async function me(req, res) {
  const { rows } = await query('SELECT id, cpf, celular, email, role, nome FROM users WHERE id = $1', [
    req.user.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(rows[0]);
}
