import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/requisicoes.js';
import Indicador from '../../componentes/Indicador.jsx';

export default function PainelCliente() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/client')
      .then(setDados)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="page">Carregando...</div>;

  return (
    <div className="page">
      <h1>Bem-vindo de volta!</h1>
      <p className="subtitle">Confira suas visitas, descontos e promoções ativas.</p>

      <div className="grid cols-3" style={{ marginBottom: 20 }}>
        <Indicador value={dados.totalVisitas} label="Visitas registradas" />
        <Indicador value={dados.totalDescontosGanhos} label="Descontos ganhos" />
        <Indicador value={dados.banner.length} label="Promoções ativas" />
      </div>

      <div className="card">
        <h3>Estabelecimentos em promoção</h3>
        {dados.banner.length === 0 && <div className="empty-state">Nenhuma promoção ativa no momento.</div>}
        <div className="grid cols-3">
          {dados.banner.map((e) => (
            <div key={`${e.id}-${e.percentual_desconto}`} className="card" style={{ margin: 0 }}>
              <strong>{e.nome}</strong>
              <p style={{ color: 'var(--red-600)', fontWeight: 700, margin: '6px 0' }}>
                {e.percentual_desconto}% a cada {e.visitas_necessarias} visitas
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid cols-3">
        <Link to="/cliente/favoritos" className="card" style={{ textAlign: 'center' }}>
          ⭐ Favoritos
        </Link>
        <Link to="/cliente/fidelizacao" className="card" style={{ textAlign: 'center' }}>
          🏷️ Minhas Visitas
        </Link>
        <Link to="/cliente/saude" className="card" style={{ textAlign: 'center' }}>
          🩺 Minha Saúde
        </Link>
      </div>
    </div>
  );
}
