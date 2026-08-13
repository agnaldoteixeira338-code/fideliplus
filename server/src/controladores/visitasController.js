import { query } from '../configuracao/bancoDados.js';
import { registerVisit } from '../servicos/servicoFidelizacao.js';

async function getMyEstablishmentId(ownerId) {
  const { rows } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [ownerId]);
  return rows[0]?.id ?? null;
}

export async function checkin(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { cpf, clientId } = req.body;
  let client;

  if (clientId) {
    const { rows } = await query('SELECT id, nome, cpf FROM users WHERE id = $1 AND role = $2', [
      clientId,
      'cliente',
    ]);
    client = rows[0];
  } else if (cpf) {
    const { rows } = await query('SELECT id, nome, cpf FROM users WHERE cpf = $1 AND role = $2', [cpf, 'cliente']);
    client = rows[0];
  } else {
    return res.status(400).json({ error: 'Informe cpf ou clientId' });
  }

  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });

  const result = await registerVisit(client.id, establishmentId);
  res.status(201).json({ client, ...result });
}

export async function establishmentVisits(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { period } = req.query;
  let interval = "1 day";
  if (period === 'month') interval = "30 days";

  const { rows } = await query(
    `SELECT v.id, v.visited_at, v.desconto_aplicado, u.nome, u.cpf
     FROM visits v JOIN users u ON u.id = v.client_id
     WHERE v.establishment_id = $1 AND v.visited_at >= now() - $2::interval
     ORDER BY v.visited_at DESC`,
    [establishmentId, interval]
  );

  res.json(rows);
}

export async function myVisits(req, res) {
  const { rows } = await query(
    `SELECT v.id, v.visited_at, v.desconto_aplicado, e.nome AS estabelecimento, e.id AS establishment_id
     FROM visits v JOIN establishments e ON e.id = v.establishment_id
     WHERE v.client_id = $1
     ORDER BY v.visited_at DESC`,
    [req.user.id]
  );
  res.json(rows);
}
