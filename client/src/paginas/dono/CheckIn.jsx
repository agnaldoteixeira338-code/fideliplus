import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';

export default function CheckIn() {
  const [cpf, setCpf] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [visitas, setVisitas] = useState([]);
  const [periodo, setPeriodo] = useState('day');
  const { showToast } = useToast();

  useEffect(() => {
    carregarVisitas();
  }, [periodo]);

  function carregarVisitas() {
    api.get('/loyalty/visits', { period: periodo }).then(setVisitas);
  }

  async function fazerCheckin(e) {
    e.preventDefault();
    if (!cpf) return;
    setEnviando(true);
    try {
      const res = await api.post('/loyalty/checkin', { cpf });
      const nome = res.client.nome || res.client.cpf;
      if (res.triggeredRules.length > 0) {
        showToast(`${nome} ganhou ${res.descontoAplicado}% de desconto! (${res.totalVisits}ª visita)`, 'success');
      } else {
        showToast(
          `Check-in registrado para ${nome}. Faltam ${res.faltamParaProximo ?? '-'} visita(s) para o próximo desconto.`,
          'success'
        );
      }
      setCpf('');
      carregarVisitas();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="page">
      <h1>Controle de Visitas</h1>
      <p className="subtitle">Faça check-in manual do cliente pelo CPF.</p>

      <form className="card" onSubmit={fazerCheckin} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label>CPF do cliente</label>
          <input
            className="input"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>
        <button className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Fazer check-in'}
        </button>
      </form>

      <p className="subtitle">
        Dica: use o CPF do cliente demo (<strong>000.000.000-00</strong>) para testar o fluxo completo.
      </p>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Histórico de visitas</h3>
          <select className="input" style={{ width: 160 }} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="day">Hoje</option>
            <option value="month">Este mês</option>
          </select>
        </div>
        {visitas.length === 0 && <div className="empty-state">Nenhuma visita no período.</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CPF</th>
              <th>Data</th>
              <th>Desconto</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((v) => (
              <tr key={v.id}>
                <td>{v.nome}</td>
                <td>{v.cpf}</td>
                <td>{new Date(v.visited_at).toLocaleString('pt-BR')}</td>
                <td>{v.desconto_aplicado ? <span className="badge badge-green">{v.desconto_aplicado}%</span> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
