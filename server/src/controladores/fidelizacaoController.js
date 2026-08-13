import { query } from '../configuracao/bancoDados.js';
import { getClientProgress } from '../servicos/servicoFidelizacao.js';

async function getOwnedEstablishmentId(ownerId, establishmentId) {
  const { rows } = await query('SELECT id FROM establishments WHERE id = $1 AND owner_id = $2', [
    establishmentId,
    ownerId,
  ]);
  return rows[0]?.id ?? null;
}

async function getMyEstablishmentId(ownerId) {
  const { rows } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [ownerId]);
  return rows[0]?.id ?? null;
}

export async function listRules(req, res) {
  const establishmentId = req.query.establishmentId || (await getMyEstablishmentId(req.user.id));
  if (!establishmentId) return res.status(400).json({ error: 'establishmentId é obrigatório' });

  const { rows } = await query(
    'SELECT * FROM discount_rules WHERE establishment_id = $1 ORDER BY visitas_necessarias',
    [establishmentId]
  );
  res.json(rows);
}

export async function createRule(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { visitas_necessarias, percentual_desconto } = req.body;
  if (!visitas_necessarias || !percentual_desconto) {
    return res.status(400).json({ error: 'visitas_necessarias e percentual_desconto são obrigatórios' });
  }

  const { rows } = await query(
    'INSERT INTO discount_rules (establishment_id, visitas_necessarias, percentual_desconto) VALUES ($1, $2, $3) RETURNING *',
    [establishmentId, visitas_necessarias, percentual_desconto]
  );
  res.status(201).json(rows[0]);
}

export async function updateRule(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  const owned = await getOwnedEstablishmentId(req.user.id, establishmentId);
  if (!owned) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { visitas_necessarias, percentual_desconto, ativo } = req.body;

  const { rows } = await query(
    `UPDATE discount_rules SET
       visitas_necessarias = COALESCE($1, visitas_necessarias),
       percentual_desconto = COALESCE($2, percentual_desconto),
       ativo = COALESCE($3, ativo)
     WHERE id = $4 AND establishment_id = $5
     RETURNING *`,
    [visitas_necessarias, percentual_desconto, ativo, req.params.id, establishmentId]
  );

  if (!rows[0]) return res.status(404).json({ error: 'Regra não encontrada' });
  res.json(rows[0]);
}

export async function deleteRule(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  const { rowCount } = await query('DELETE FROM discount_rules WHERE id = $1 AND establishment_id = $2', [
    req.params.id,
    establishmentId,
  ]);
  if (!rowCount) return res.status(404).json({ error: 'Regra não encontrada' });
  res.status(204).end();
}

export async function ruleCustomers(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  const { rows: ruleRows } = await query('SELECT * FROM discount_rules WHERE id = $1 AND establishment_id = $2', [
    req.params.id,
    establishmentId,
  ]);
  const rule = ruleRows[0];
  if (!rule) return res.status(404).json({ error: 'Regra não encontrada' });

  const { rows } = await query(
    `SELECT u.id, u.nome, u.cpf, u.email, COUNT(v.id)::int AS total_visitas
     FROM users u
     JOIN visits v ON v.client_id = u.id AND v.establishment_id = $1
     GROUP BY u.id
     HAVING COUNT(v.id) >= $2
     ORDER BY total_visitas DESC`,
    [establishmentId, rule.visitas_necessarias]
  );

  res.json(rows);
}

export async function myProgress(req, res) {
  const establishmentId = req.query.establishmentId;
  if (!establishmentId) return res.status(400).json({ error: 'establishmentId é obrigatório' });
  const progress = await getClientProgress(req.user.id, establishmentId);
  res.json(progress);
}

export async function myProgressSummary(req, res) {
  const { rows: establishments } = await query(
    `SELECT DISTINCT e.id, e.nome, e.logo_url FROM establishments e
     JOIN visits v ON v.establishment_id = e.id
     WHERE v.client_id = $1`,
    [req.user.id]
  );

  const summary = [];
  for (const est of establishments) {
    const progress = await getClientProgress(req.user.id, est.id);
    summary.push({ establishment: est, ...progress });
  }

  res.json(summary);
}
