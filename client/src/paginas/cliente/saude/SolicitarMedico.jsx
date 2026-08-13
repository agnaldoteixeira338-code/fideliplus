import { useState } from 'react';
import { api } from '../../../api/requisicoes.js';
import { useToast } from '../../../contexto/ContextoNotificacoes.jsx';

const ESPECIALIDADES = ['Cardiologista', 'Dermatologista', 'Ortopedista', 'Clínico Geral', 'Pediatra'];

export default function SolicitarMedico({ onSolicitado }) {
  const [especialidade, setEspecialidade] = useState(ESPECIALIDADES[0]);
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { showToast } = useToast();

  async function solicitar(e) {
    e.preventDefault();
    if (!data || !horario) {
      showToast('Informe data e horário.', 'error');
      return;
    }
    setEnviando(true);
    try {
      await api.post('/health/requests', {
        especialidade,
        data_preferencial: data,
        horario_preferencial: horario,
      });
      showToast('Solicitação enviada! Acompanhe o status abaixo.', 'success');
      setData('');
      setHorario('');
      onSolicitado?.();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="card" onSubmit={solicitar}>
      <h3>Solicitar médico via plano</h3>
      <div className="grid cols-3">
        <div className="field">
          <label>Especialidade</label>
          <select className="input" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)}>
            {ESPECIALIDADES.map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Data</label>
          <input type="date" className="input" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="field">
          <label>Horário</label>
          <input type="time" className="input" value={horario} onChange={(e) => setHorario(e.target.value)} />
        </div>
      </div>
      <button className="btn btn-primary" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Solicitar'}
      </button>
    </form>
  );
}
