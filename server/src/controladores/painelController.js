import { query } from '../configuracao/bancoDados.js';

const TICKET_MEDIO_ESTIMADO = 50;

async function getMyEstablishmentId(ownerId) {
  const { rows } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [ownerId]);
  return rows[0]?.id ?? null;
}

export async function ownerDashboard(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { rows: totalClientes } = await query(
    'SELECT COUNT(DISTINCT client_id)::int AS total FROM visits WHERE establishment_id = $1',
    [establishmentId]
  );

  const { rows: fieis } = await query(
    `SELECT COUNT(*)::int AS total FROM (
       SELECT client_id FROM visits WHERE establishment_id = $1 GROUP BY client_id HAVING COUNT(*) > 10
     ) t`,
    [establishmentId]
  );

  const { rows: descontosHoje } = await query(
    `SELECT COUNT(*)::int AS total FROM visits
     WHERE establishment_id = $1 AND desconto_aplicado IS NOT NULL AND visited_at >= CURRENT_DATE`,
    [establishmentId]
  );

  const { rows: descontosMes } = await query(
    `SELECT COUNT(*)::int AS total FROM visits
     WHERE establishment_id = $1 AND desconto_aplicado IS NOT NULL AND visited_at >= date_trunc('month', now())`,
    [establishmentId]
  );

  const { rows: visitasMes } = await query(
    `SELECT COUNT(*)::int AS total FROM visits
     WHERE establishment_id = $1 AND visited_at >= date_trunc('month', now())`,
    [establishmentId]
  );

  res.json({
    totalClientes: totalClientes[0].total,
    clientesFieis: fieis[0].total,
    descontosHoje: descontosHoje[0].total,
    descontosMes: descontosMes[0].total,
    faturamentoEstimadoMes: visitasMes[0].total * TICKET_MEDIO_ESTIMADO,
    observacao: 'Faturamento estimado = visitas do mês × ticket médio fixo de teste (R$ 50).',
  });
}

export async function clientDashboard(req, res) {
  const { rows: promoEstablishments } = await query(
    `SELECT DISTINCT e.id, e.nome, e.logo_url, r.percentual_desconto, r.visitas_necessarias
     FROM establishments e
     JOIN discount_rules r ON r.establishment_id = e.id AND r.ativo = true
     WHERE e.ativo = true
     ORDER BY r.percentual_desconto DESC
     LIMIT 5`
  );

  const { rows: totalVisits } = await query('SELECT COUNT(*)::int AS total FROM visits WHERE client_id = $1', [
    req.user.id,
  ]);

  const { rows: totalDiscounts } = await query(
    'SELECT COUNT(*)::int AS total FROM visits WHERE client_id = $1 AND desconto_aplicado IS NOT NULL',
    [req.user.id]
  );

  res.json({
    banner: promoEstablishments,
    totalVisitas: totalVisits[0].total,
    totalDescontosGanhos: totalDiscounts[0].total,
  });
}
