import { query } from '../configuracao/bancoDados.js';

export async function countVisits(clientId, establishmentId) {
  const { rows } = await query(
    'SELECT COUNT(*)::int AS total FROM visits WHERE client_id = $1 AND establishment_id = $2',
    [clientId, establishmentId]
  );
  return rows[0].total;
}

export async function getActiveRules(establishmentId) {
  const { rows } = await query(
    'SELECT * FROM discount_rules WHERE establishment_id = $1 AND ativo = true ORDER BY visitas_necessarias',
    [establishmentId]
  );
  return rows;
}

export async function registerVisit(clientId, establishmentId) {
  const rules = await getActiveRules(establishmentId);

  const { rows: inserted } = await query(
    'INSERT INTO visits (client_id, establishment_id) VALUES ($1, $2) RETURNING id, visited_at',
    [clientId, establishmentId]
  );

  const totalVisits = await countVisits(clientId, establishmentId);

  const triggeredRules = rules.filter((rule) => totalVisits % rule.visitas_necessarias === 0);
  const descontoTotal = triggeredRules.reduce((sum, rule) => sum + Number(rule.percentual_desconto), 0);

  if (descontoTotal > 0) {
    await query('UPDATE visits SET desconto_aplicado = $1 WHERE id = $2', [descontoTotal, inserted[0].id]);
  }

  const nextRule = rules
    .filter((rule) => totalVisits % rule.visitas_necessarias !== 0)
    .sort((a, b) => (totalVisits % a.visitas_necessarias) - (totalVisits % b.visitas_necessarias))[0];

  return {
    visitId: inserted[0].id,
    visitedAt: inserted[0].visited_at,
    totalVisits,
    triggeredRules,
    descontoAplicado: descontoTotal || null,
    faltamParaProximo: nextRule
      ? nextRule.visitas_necessarias - (totalVisits % nextRule.visitas_necessarias)
      : null,
    proximaRegra: nextRule || null,
  };
}

export async function getClientProgress(clientId, establishmentId) {
  const rules = await getActiveRules(establishmentId);
  const totalVisits = await countVisits(clientId, establishmentId);

  const progress = rules.map((rule) => {
    const restante = rule.visitas_necessarias - (totalVisits % rule.visitas_necessarias);
    return {
      ...rule,
      faltam: totalVisits === 0 ? rule.visitas_necessarias : restante === rule.visitas_necessarias ? 0 : restante,
    };
  });

  const { rows: history } = await query(
    `SELECT id, visited_at, desconto_aplicado FROM visits
     WHERE client_id = $1 AND establishment_id = $2 AND desconto_aplicado IS NOT NULL
     ORDER BY visited_at DESC`,
    [clientId, establishmentId]
  );

  return { totalVisits, rules: progress, discountHistory: history };
}
