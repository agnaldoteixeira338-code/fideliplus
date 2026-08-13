import { useState } from 'react';
import { api, downloadBlob } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';

export default function Relatorios() {
  const [de, setDe] = useState('');
  const [ate, setAte] = useState('');
  const [resumoFidelizacao, setResumoFidelizacao] = useState(null);
  const [resumoSaude, setResumoSaude] = useState(null);
  const { showToast } = useToast();

  async function visualizarFidelizacao() {
    const data = await api.get('/reports/loyalty', { from: de, to: ate });
    setResumoFidelizacao(data);
  }

  async function visualizarSaude() {
    const data = await api.get('/reports/health');
    setResumoSaude(data);
  }

  async function exportarCsv(tipo) {
    try {
      const path = tipo === 'fidelizacao' ? '/reports/loyalty' : '/reports/health';
      const params = tipo === 'fidelizacao' ? { from: de, to: ate, format: 'csv' } : { format: 'csv' };
      const blob = await api.get(path, params);
      downloadBlob(blob, `relatorio_${tipo}.csv`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page">
      <h1>Relatórios</h1>
      <p className="subtitle">Fidelização e uso do módulo de saúde, com exportação em CSV.</p>

      <div className="card">
        <h3>Relatório de Fidelização</h3>
        <div className="grid cols-3">
          <div className="field">
            <label>De</label>
            <input type="date" className="input" value={de} onChange={(e) => setDe(e.target.value)} />
          </div>
          <div className="field">
            <label>Até</label>
            <input type="date" className="input" value={ate} onChange={(e) => setAte(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={visualizarFidelizacao}>
            Visualizar
          </button>
          <button className="btn btn-primary" onClick={() => exportarCsv('fidelizacao')}>
            Exportar CSV
          </button>
        </div>

        {resumoFidelizacao && (
          <div className="grid cols-3" style={{ marginTop: 16 }}>
            <div className="stat-tile">
              <div className="value">{resumoFidelizacao.totalVisitas}</div>
              <div className="label">Visitas no período</div>
            </div>
            <div className="stat-tile">
              <div className="value">{resumoFidelizacao.totalDescontosConcedidos}</div>
              <div className="label">Descontos concedidos</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Relatório do Módulo de Saúde</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={visualizarSaude}>
            Visualizar
          </button>
          <button className="btn btn-primary" onClick={() => exportarCsv('saude')}>
            Exportar CSV
          </button>
        </div>

        {resumoSaude && (
          <div style={{ marginTop: 16 }}>
            <div className="stat-tile" style={{ marginBottom: 12 }}>
              <div className="value">{resumoSaude.totalSolicitacoes}</div>
              <div className="label">Solicitações médicas registradas</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
