import { query } from '../configuracao/bancoDados.js';

export async function listMyFavorites(req, res) {
  const { sort } = req.query;

  let orderBy = 'f.created_at DESC';
  if (sort === 'visitados') orderBy = 'total_visitas DESC';
  else if (sort === 'desconto') orderBy = 'ultimo_desconto DESC NULLS LAST';

  const { rows } = await query(
    `SELECT e.*, f.created_at AS favorited_at,
        (SELECT COUNT(*) FROM visits v WHERE v.client_id = $1 AND v.establishment_id = e.id)::int AS total_visitas,
        (SELECT MAX(v.desconto_aplicado) FROM visits v WHERE v.client_id = $1 AND v.establishment_id = e.id AND v.desconto_aplicado IS NOT NULL) AS ultimo_desconto
     FROM favorites f
     JOIN establishments e ON e.id = f.establishment_id
     WHERE f.client_id = $1
     ORDER BY ${orderBy}`,
    [req.user.id]
  );

  res.json(rows);
}

export async function addFavorite(req, res) {
  const { establishmentId } = req.body;
  if (!establishmentId) return res.status(400).json({ error: 'establishmentId é obrigatório' });

  const { rows } = await query(
    `INSERT INTO favorites (client_id, establishment_id) VALUES ($1, $2)
     ON CONFLICT (client_id, establishment_id) DO NOTHING
     RETURNING *`,
    [req.user.id, establishmentId]
  );

  res.status(201).json(rows[0] ?? { message: 'Já era favorito' });
}

export async function removeFavorite(req, res) {
  const { rowCount } = await query('DELETE FROM favorites WHERE client_id = $1 AND establishment_id = $2', [
    req.user.id,
    req.params.establishmentId,
  ]);
  if (!rowCount) return res.status(404).json({ error: 'Favorito não encontrado' });
  res.status(204).end();
}

export async function establishmentFavoritedBy(req, res) {
  const { rows: owned } = await query('SELECT id FROM establishments WHERE id = $1 AND owner_id = $2', [
    req.params.id,
    req.user.id,
  ]);
  if (!owned[0]) return res.status(404).json({ error: 'Estabelecimento não encontrado' });

  const { rows } = await query(
    `SELECT u.id, u.nome, u.cpf, u.email, f.created_at AS favorited_at
     FROM favorites f JOIN users u ON u.id = f.client_id
     WHERE f.establishment_id = $1
     ORDER BY f.created_at DESC`,
    [req.params.id]
  );
  res.json(rows);
}
