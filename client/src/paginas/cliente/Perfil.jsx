import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useAuth } from '../../contexto/ContextoAutenticacao.jsx';

export default function Perfil() {
  const { user } = useAuth();
  const [visitas, setVisitas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api
      .get('/loyalty/my-visits')
      .then(setVisitas)
      .finally(() => setCarregando(false));
  }, []);

  const totalDescontos = visitas.filter((v) => v.desconto_aplicado).length;

  return (
    <div className="page">
      <h1>Meu Perfil</h1>

      <div className="card">
        <h3>Dados cadastrados</h3>
        <div className="grid cols-3">
          <div>
            <div className="subtitle">CPF</div>
            <strong>{user.cpf}</strong>
          </div>
          <div>
            <div className="subtitle">Celular</div>
            <strong>{user.celular || '-'}</strong>
          </div>
          <div>
            <div className="subtitle">Gmail</div>
            <strong>{user.email}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Resumo</h3>
        <div className="grid cols-2">
          <div>
            <div className="subtitle">Total de visitas</div>
            <strong>{visitas.length}</strong>
          </div>
          <div>
            <div className="subtitle">Total de descontos acumulados</div>
            <strong>{totalDescontos}</strong>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Histórico de visitas</h3>
        {carregando && <div>Carregando...</div>}
        {!carregando && visitas.length === 0 && <div className="empty-state">Nenhuma visita registrada.</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Estabelecimento</th>
              <th>Data</th>
              <th>Desconto</th>
            </tr>
          </thead>
          <tbody>
            {visitas.map((v) => (
              <tr key={v.id}>
                <td>{v.estabelecimento}</td>
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
