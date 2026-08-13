import { useState } from 'react';
import { api } from '../../../api/requisicoes.js';

function ListaLocais({ titulo, itens }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>
      {itens.length === 0 && <div className="empty-state">Nenhum resultado.</div>}
      {itens.map((item, i) => (
        <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
          <strong>{item.nome}</strong>
          {item.especialidade && <span className="badge badge-red" style={{ marginLeft: 8 }}>{item.especialidade}</span>}
          <p className="subtitle" style={{ margin: '4px 0' }}>
            {item.endereco} · {item.distanciaKm} km · {item.telefone}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function BuscaProxima() {
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [especialidade, setEspecialidade] = useState('');

  async function buscar() {
    setBuscando(true);
    try {
      const data = await api.get('/health/nearby', especialidade ? { especialidade } : undefined);
      setResultado(data);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Buscar serviços próximos</h3>
        <p className="subtitle">Simulação de geolocalização — resultados de demonstração.</p>
        <div className="field" style={{ maxWidth: 300 }}>
          <label>Filtrar médicos por especialidade (opcional)</label>
          <input
            className="input"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            placeholder="Ex: Cardiologista"
          />
        </div>
        <button className="btn btn-primary" onClick={buscar} disabled={buscando}>
          {buscando ? 'Buscando...' : 'Encontrar mais próximos'}
        </button>
      </div>

      {resultado && (
        <div className="grid cols-3">
          <ListaLocais titulo="Hospitais próximos" itens={resultado.hospitais} />
          <ListaLocais titulo="Farmácias próximas" itens={resultado.farmacias} />
          <ListaLocais titulo="Médicos próximos" itens={resultado.medicos} />
        </div>
      )}
    </div>
  );
}
