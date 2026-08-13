import { query } from '../configuracao/bancoDados.js';

export async function listEstablishments(req, res) {
  const { rows } = await query(
    `SELECT id, nome, endereco, cidade, estado, telefone, logo_url, hora_abertura, hora_fechamento, saude_parceiro, ativo
     FROM establishments WHERE ativo = true ORDER BY nome`
  );
  res.json(rows);
}

export async function getEstablishment(req, res) {
  const { rows } = await query('SELECT * FROM establishments WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Estabelecimento não encontrado' });
  res.json(rows[0]);
}

export async function getMyEstablishment(req, res) {
  const { rows } = await query('SELECT * FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [
    req.user.id,
  ]);
  if (!rows[0]) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });
  res.json(rows[0]);
}

export async function updateMyEstablishment(req, res) {
  const { nome, endereco, cidade, estado, telefone, logo_url, hora_abertura, hora_fechamento, saude_parceiro } =
    req.body;

  const { rows: existing } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [
    req.user.id,
  ]);

  if (!existing[0]) {
    return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado para este dono' });
  }

  const { rows } = await query(
    `UPDATE establishments SET
       nome = COALESCE($1, nome),
       endereco = COALESCE($2, endereco),
       cidade = COALESCE($3, cidade),
       estado = COALESCE($4, estado),
       telefone = COALESCE($5, telefone),
       logo_url = COALESCE($6, logo_url),
       hora_abertura = COALESCE($7, hora_abertura),
       hora_fechamento = COALESCE($8, hora_fechamento),
       saude_parceiro = COALESCE($9, saude_parceiro)
     WHERE id = $10
     RETURNING *`,
    [nome, endereco, cidade, estado, telefone, logo_url, hora_abertura, hora_fechamento, saude_parceiro, existing[0].id]
  );

  res.json(rows[0]);
}
