import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [todos, setTodos] = useState([]);
  const [ordenacao, setOrdenacao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    carregar();
  }, [ordenacao]);

  function carregar() {
    setCarregando(true);
    Promise.all([api.get('/favorites', { sort: ordenacao }), api.get('/establishments')])
      .then(([favs, ests]) => {
        setFavoritos(favs);
        setTodos(ests);
      })
      .finally(() => setCarregando(false));
  }

  async function favoritar(establishmentId) {
    try {
      await api.post('/favorites', { establishmentId });
      showToast('Estabelecimento adicionado aos favoritos!', 'success');
      carregar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function desfavoritar(establishmentId) {
    try {
      await api.del(`/favorites/${establishmentId}`);
      showToast('Removido dos favoritos.', 'success');
      carregar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  if (carregando) return <div className="page">Carregando...</div>;

  const idsFavoritados = new Set(favoritos.map((f) => f.id));
  const naoFavoritados = todos.filter((e) => !idsFavoritados.has(e.id));

  return (
    <div className="page">
      <h1>Favoritos</h1>
      <p className="subtitle">Estabelecimentos que você marcou com estrela.</p>

      <div className="field" style={{ maxWidth: 260 }}>
        <label>Ordenar por</label>
        <select className="input" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
          <option value="">Mais recentes</option>
          <option value="visitados">Mais visitados</option>
          <option value="desconto">Último desconto ganho</option>
        </select>
      </div>

      <div className="grid cols-3">
        {favoritos.map((f) => (
          <div key={f.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <strong>{f.nome}</strong>
              <span className="star-icon">★</span>
            </div>
            <p className="subtitle" style={{ margin: '6px 0' }}>
              {f.total_visitas} visita(s) {f.ultimo_desconto ? `· último desconto ${f.ultimo_desconto}%` : ''}
            </p>
            <button className="btn btn-secondary btn-block" onClick={() => desfavoritar(f.id)}>
              Remover dos favoritos
            </button>
          </div>
        ))}
      </div>

      {favoritos.length === 0 && (
        <div className="card">
          <div className="empty-state">Você ainda não tem favoritos.</div>
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>Outros estabelecimentos</h3>
      <div className="grid cols-3">
        {naoFavoritados.map((e) => (
          <div key={e.id} className="card">
            <strong>{e.nome}</strong>
            <p className="subtitle" style={{ margin: '6px 0' }}>
              {e.cidade ? `${e.cidade} - ${e.estado}` : ''}
            </p>
            <button className="btn btn-primary btn-block" onClick={() => favoritar(e.id)}>
              ☆ Favoritar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
