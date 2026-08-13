import { query } from '../configuracao/bancoDados.js';
import { nearbyHospitals, nearbyPharmacies, nearbyDoctors, availableDoctorsFor } from '../servicos/saudeMock.js';

export async function getMyHealthData(req, res) {
  const { rows } = await query('SELECT * FROM health_data WHERE client_id = $1', [req.user.id]);
  res.json(rows[0] ?? null);
}

export async function upsertMyHealthData(req, res) {
  const { plano_nome, carteirinha, validade, alergias, condicoes_especiais } = req.body;

  const { rows } = await query(
    `INSERT INTO health_data (client_id, plano_nome, carteirinha, validade, alergias, condicoes_especiais)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (client_id) DO UPDATE SET
       plano_nome = EXCLUDED.plano_nome,
       carteirinha = EXCLUDED.carteirinha,
       validade = EXCLUDED.validade,
       alergias = EXCLUDED.alergias,
       condicoes_especiais = EXCLUDED.condicoes_especiais,
       updated_at = now()
     RETURNING *`,
    [req.user.id, plano_nome, carteirinha, validade, alergias, condicoes_especiais]
  );

  res.json(rows[0]);
}

export async function nearby(req, res) {
  const { type, especialidade } = req.query;

  if (type === 'hospital') return res.json(nearbyHospitals());
  if (type === 'farmacia') return res.json(nearbyPharmacies());
  if (type === 'medico') return res.json(nearbyDoctors(especialidade));

  res.json({
    hospitais: nearbyHospitals(),
    farmacias: nearbyPharmacies(),
    medicos: nearbyDoctors(especialidade),
  });
}

export async function createRequest(req, res) {
  const { especialidade, data_preferencial, horario_preferencial } = req.body;
  if (!especialidade || !data_preferencial || !horario_preferencial) {
    return res.status(400).json({ error: 'especialidade, data_preferencial e horario_preferencial são obrigatórios' });
  }

  const disponiveis = availableDoctorsFor(especialidade);
  if (disponiveis.length === 0) {
    return res.status(404).json({ error: 'Nenhum médico credenciado disponível para essa especialidade' });
  }

  const medico = disponiveis[0];

  const { rows } = await query(
    `INSERT INTO medical_requests (client_id, especialidade, data_preferencial, horario_preferencial, medico_nome, hospital_nome, endereco)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [req.user.id, especialidade, data_preferencial, horario_preferencial, medico.nome, medico.nome.startsWith('Dr') ? 'Hospital São Lucas' : medico.nome, medico.endereco]
  );

  res.status(201).json(rows[0]);
}

export async function myRequests(req, res) {
  const { rows } = await query('SELECT * FROM medical_requests WHERE client_id = $1 ORDER BY created_at DESC', [
    req.user.id,
  ]);
  res.json(rows);
}

const NEXT_STATUS = {
  pendente: 'confirmado',
  confirmado: 'concluido',
};

export async function advanceRequestStatus(req, res) {
  const { rows } = await query('SELECT * FROM medical_requests WHERE id = $1 AND client_id = $2', [
    req.params.id,
    req.user.id,
  ]);
  const request = rows[0];
  if (!request) return res.status(404).json({ error: 'Solicitação não encontrada' });

  const next = NEXT_STATUS[request.status];
  if (!next) return res.status(400).json({ error: `Solicitação já está em status final (${request.status})` });

  const { rows: updated } = await query(
    'UPDATE medical_requests SET status = $1, updated_at = now() WHERE id = $2 RETURNING *',
    [next, req.params.id]
  );
  res.json(updated[0]);
}

export async function cancelRequest(req, res) {
  const { rows } = await query('SELECT * FROM medical_requests WHERE id = $1 AND client_id = $2', [
    req.params.id,
    req.user.id,
  ]);
  const request = rows[0];
  if (!request) return res.status(404).json({ error: 'Solicitação não encontrada' });

  if (['concluido', 'cancelado'].includes(request.status)) {
    return res.status(400).json({ error: 'Não é possível cancelar uma solicitação já concluída ou cancelada' });
  }

  const { rows: updated } = await query(
    "UPDATE medical_requests SET status = 'cancelado', updated_at = now() WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json(updated[0]);
}

export async function healthReport(req, res) {
  const { rows: withPlan } = await query('SELECT COUNT(*)::int AS total FROM health_data');
  const { rows: requests } = await query(
    `SELECT status, COUNT(*)::int AS total FROM medical_requests GROUP BY status`
  );
  res.json({ clientesComPlano: withPlan[0].total, solicitacoesPorStatus: requests });
}
