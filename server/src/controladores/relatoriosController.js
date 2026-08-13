import { query } from '../configuracao/bancoDados.js';

async function getMyEstablishmentId(ownerId) {
  const { rows } = await query('SELECT id FROM establishments WHERE owner_id = $1 ORDER BY id LIMIT 1', [ownerId]);
  return rows[0]?.id ?? null;
}

function toCsv(rows, columns) {
  const header = columns.join(';');
  const body = rows
    .map((row) => columns.map((col) => String(row[col] ?? '').replace(/;/g, ',')).join(';'))
    .join('\n');
  return `${header}\n${body}`;
}

function dateFilter(from, to) {
  const clauses = [];
  const params = [];
  if (from) {
    params.push(from);
    clauses.push(`visited_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    clauses.push(`visited_at <= $${params.length}`);
  }
  return { clauses, params };
}

export async function loyaltyReport(req, res) {
  const establishmentId = await getMyEstablishmentId(req.user.id);
  if (!establishmentId) return res.status(404).json({ error: 'Nenhum estabelecimento cadastrado' });

  const { from, to, format } = req.query;
  const { clauses, params } = dateFilter(from, to);
  const whereExtra = clauses.length ? `AND ${clauses.join(' AND ')}` : '';

  const { rows } = await query(
    `SELECT u.nome AS cliente, u.cpf, v.visited_at, v.desconto_aplicado
     FROM visits v JOIN users u ON u.id = v.client_id
     WHERE v.establishment_id = $1 ${whereExtra}
     ORDER BY v.visited_at DESC`,
    [establishmentId, ...params]
  );

  if (format === 'csv') {
    const csv = toCsv(rows, ['cliente', 'cpf', 'visited_at', 'desconto_aplicado']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_fidelizacao.csv"');
    return res.send(csv);
  }

  res.json({
    totalVisitas: rows.length,
    totalDescontosConcedidos: rows.filter((r) => r.desconto_aplicado).length,
    rows,
  });
}

export async function healthReportExport(req, res) {
  const { format } = req.query;

  const { rows } = await query(
    `SELECT u.nome AS cliente, u.cpf, hd.plano_nome, mr.especialidade, mr.status, mr.created_at
     FROM medical_requests mr
     JOIN users u ON u.id = mr.client_id
     LEFT JOIN health_data hd ON hd.client_id = mr.client_id
     ORDER BY mr.created_at DESC`
  );

  if (format === 'csv') {
    const csv = toCsv(rows, ['cliente', 'cpf', 'plano_nome', 'especialidade', 'status', 'created_at']);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio_saude.csv"');
    return res.send(csv);
  }

  res.json({ totalSolicitacoes: rows.length, rows });
}
