import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import MeusDados from './saude/MeusDados.jsx';
import BuscaProxima from './saude/BuscaProxima.jsx';
import SolicitarMedico from './saude/SolicitarMedico.jsx';
import StatusSolicitacao from './saude/StatusSolicitacao.jsx';

const ABAS = [
  { id: 'dados', label: 'Meus Dados' },
  { id: 'busca', label: 'Busca Próxima' },
  { id: 'solicitar', label: 'Solicitar Médico' },
  { id: 'status', label: 'Status da Solicitação' },
];

export default function Saude() {
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  function carregarSolicitacoes() {
    api.get('/health/requests').then(setSolicitacoes);
  }

  return (
    <div className="page">
      <h1>Módulo de Saúde</h1>
      <p className="subtitle">Cadastre seu plano, encontre serviços próximos e solicite consultas.</p>

      <div className="tabbar" style={{ background: 'transparent', border: 'none', marginBottom: 16, padding: 0 }}>
        {ABAS.map((aba) => (
          <button
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={aba.id === abaAtiva ? 'active' : ''}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px 14px',
              fontWeight: 600,
              fontSize: 14,
              color: aba.id === abaAtiva ? 'var(--red-600)' : 'var(--gray-700)',
              borderBottom: aba.id === abaAtiva ? '3px solid var(--red-600)' : '3px solid transparent',
            }}
          >
            {aba.label}
          </button>
        ))}
      </div>

      {abaAtiva === 'dados' && <MeusDados />}
      {abaAtiva === 'busca' && <BuscaProxima />}
      {abaAtiva === 'solicitar' && <SolicitarMedico onSolicitado={carregarSolicitacoes} />}
      {abaAtiva === 'status' && <StatusSolicitacao solicitacoes={solicitacoes} onAtualizado={carregarSolicitacoes} />}
    </div>
  );
}
