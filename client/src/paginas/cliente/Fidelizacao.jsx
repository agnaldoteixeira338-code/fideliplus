import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import BarraProgresso from '../../componentes/BarraProgresso.jsx';

export default function Fidelizacao() {
  const [resumo, setResumo] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setCarregando(true);
    api
      .get('/loyalty/my-progress-summary')
      .then(setResumo)
      .finally(() => setCarregando(false));
  }

  if (carregando) return <div className="page">Carregando...</div>;

  return (
    <div className="page">
      <h1>Fidelização</h1>
      <p className="subtitle">Acompanhe suas visitas e descontos em cada estabelecimento.</p>

      {resumo.length === 0 && (
        <div className="card">
          <div className="empty-state">Você ainda não fez check-in em nenhum estabelecimento.</div>
        </div>
      )}

      {resumo.map((item) => (
        <div key={item.establishment.id} className="card">
          <h3>{item.establishment.nome}</h3>
          <p className="subtitle" style={{ margin: '0 0 12px' }}>
            {item.totalVisits} visita(s) registrada(s)
          </p>

          {item.rules.map((regra) => (
            <div key={regra.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>
                  {regra.faltam === 0
                    ? `🎉 Desconto de ${regra.percentual_desconto}% desbloqueado!`
                    : `Faltam ${regra.faltam} visita(s) para ganhar ${regra.percentual_desconto}% de desconto`}
                </span>
              </div>
              <BarraProgresso
                current={regra.visitas_necessarias - regra.faltam}
                total={regra.visitas_necessarias}
              />
            </div>
          ))}

          {item.discountHistory.length > 0 && (
            <>
              <h3 style={{ marginTop: 16 }}>Histórico de descontos</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Desconto</th>
                  </tr>
                </thead>
                <tbody>
                  {item.discountHistory.map((h) => (
                    <tr key={h.id}>
                      <td>{new Date(h.visited_at).toLocaleString('pt-BR')}</td>
                      <td>
                        <span className="badge badge-green">{h.desconto_aplicado}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
