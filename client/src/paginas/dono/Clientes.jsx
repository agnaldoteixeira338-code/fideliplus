import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';
import Modal from '../../componentes/Modal.jsx';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [detalhe, setDetalhe] = useState(null);
  const [modalMensagem, setModalMensagem] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(carregar, 250);
    return () => clearTimeout(timer);
  }, [busca]);

  function carregar() {
    setCarregando(true);
    api
      .get('/customers', { search: busca })
      .then(setClientes)
      .finally(() => setCarregando(false));
  }

  async function verDetalhe(id) {
    const dados = await api.get(`/customers/${id}`);
    setDetalhe(dados);
  }

  async function enviarMensagem(e) {
    e.preventDefault();
    try {
      const res = await api.post('/customers/message', { mensagem });
      showToast(`Mensagem enviada para ${res.enviadoPara.length} cliente(s) favoritos.`, 'success');
      setModalMensagem(false);
      setMensagem('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page">
      <h1>Clientes</h1>
      <p className="subtitle">Todos os clientes que já visitaram seu estabelecimento.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <input
          className="input"
          placeholder="Buscar por nome, CPF, celular ou Gmail"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={() => setModalMensagem(true)}>
          Mensagem p/ favoritos
        </button>
      </div>

      <div className="card">
        {carregando && <div>Carregando...</div>}
        {!carregando && clientes.length === 0 && <div className="empty-state">Nenhum cliente encontrado.</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Visitas</th>
              <th>Última visita</th>
              <th>Favorito</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome || c.email}</td>
                <td>{c.cpf}</td>
                <td>{c.total_visitas}</td>
                <td>{c.ultima_visita ? new Date(c.ultima_visita).toLocaleDateString('pt-BR') : '-'}</td>
                <td>{c.favorito ? '⭐' : '-'}</td>
                <td>
                  <button className="btn btn-ghost" onClick={() => verDetalhe(c.id)}>
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalhe && (
        <Modal title={detalhe.nome || detalhe.email} onClose={() => setDetalhe(null)}>
          <p>
            <strong>CPF:</strong> {detalhe.cpf} <br />
            <strong>Celular:</strong> {detalhe.celular} <br />
            <strong>Total de visitas:</strong> {detalhe.totalVisitas} <br />
            <strong>Descontos ganhos:</strong> {detalhe.descontosGanhos} <br />
            <strong>Favorito:</strong> {detalhe.favorito ? 'Sim' : 'Não'}
          </p>
          <h3>Histórico de visitas</h3>
          <table className="table">
            <tbody>
              {detalhe.visits.map((v) => (
                <tr key={v.id}>
                  <td>{new Date(v.visited_at).toLocaleString('pt-BR')}</td>
                  <td>{v.desconto_aplicado ? `${v.desconto_aplicado}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}

      {modalMensagem && (
        <Modal title="Mensagem promocional para favoritos" onClose={() => setModalMensagem(false)}>
          <form onSubmit={enviarMensagem}>
            <div className="field">
              <label>Mensagem</label>
              <textarea
                className="input"
                rows={4}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary btn-block">Enviar</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
