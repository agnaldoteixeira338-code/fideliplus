import { query } from '../configuracao/bancoDados.js';

async function getMyEstablishmentId(ownerId) {
  const { rows } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [ownerId]);
  return rows[0]?.id ?? null;
}

export async function listCustomers(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { search } = req.query;
  const params = [establishmentId];
  let filter = '';

  if (search) {
    params.push(`%${search}%`);
    filter = `AND (u.nome ILIKE $2 OR u.cpf ILIKE $2 OR u.celular ILIKE $2 OR u.email ILIKE $2)`;
  }

  const { rows } = await query(
    `SELECT u.id, u.nome, u.cpf, u.celular, u.email,
        COUNT(v.id)::int AS total_visitas,
        MAX(v.visited_at) AS ultima_visita,
        EXISTS(SELECT 1 FROM favorites f WHERE f.client_id = u.id AND f.establishment_id = $1) AS favorito
     FROM users u
     JOIN visits v ON v.client_id = u.id AND v.establishment_id = $1
     WHERE u.role = 'cliente' ${filter}
     GROUP BY u.id
     ORDER BY total_visitas DESC`,
    params
  );

  res.json(rows);
}

export async function getCustomer(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { rows: userRows } = await query('SELECT id, nome, cpf, celular, email FROM users WHERE id = $1', [
    req.params.id,
  ]);
  if (!userRows[0]) return res.status(404).json({ error: 'Cliente não encontrado' });

  const { rows: visits } = await query(
    'SELECT id, visited_at, desconto_aplicado FROM visits WHERE client_id = $1 AND establishment_id = $2 ORDER BY visited_at DESC',
    [req.params.id, establishmentId]
  );

  const { rows: fav } = await query('SELECT 1 FROM favorites WHERE client_id = $1 AND establishment_id = $2', [
    req.params.id,
    establishmentId,
  ]);

  res.json({
    ...userRows[0],
    visits,
    totalVisitas: visits.length,
    descontosGanhos: visits.filter((v) => v.desconto_aplicado).length,
    favorito: fav.length > 0,
  });
}

export async function sendPromoMessage(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { mensagem } = req.body;
  if (!mensagem) return res.status(400).json({ error: 'mensagem é obrigatória' });

  const { rows } = await query(
    `SELECT u.id, u.nome FROM favorites f JOIN users u ON u.id = f.client_id WHERE f.establishment_id = $1`,
    [establishmentId]
  );

  res.json({
    enviadoPara: rows,
    mensagem,
    observacao: 'Envio simulado — nesta versão de testes não há integração real de push/SMS.',
  });
}
