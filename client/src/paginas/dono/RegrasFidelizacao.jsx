import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';
import Modal from '../../componentes/Modal.jsx';

export default function RegrasFidelizacao() {
  const [regras, setRegras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [visitas, setVisitas] = useState(3);
  const [percentual, setPercentual] = useState(10);
  const [clientesRegra, setClientesRegra] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setCarregando(true);
    api
      .get('/loyalty/rules')
      .then(setRegras)
      .finally(() => setCarregando(false));
  }

  async function criarRegra(e) {
    e.preventDefault();
    try {
      await api.post('/loyalty/rules', {
        visitas_necessarias: Number(visitas),
        percentual_desconto: Number(percentual),
      });
      showToast('Regra criada com sucesso!', 'success');
      setModalAberto(false);
      setVisitas(3);
      setPercentual(10);
      carregar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function alternarAtiva(regra) {
    try {
      await api.put(`/loyalty/rules/${regra.id}`, { ativo: !regra.ativo });
      carregar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function excluirRegra(id) {
    try {
      await api.del(`/loyalty/rules/${id}`);
      showToast('Regra excluída.', 'success');
      carregar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function verClientes(regra) {
    const clientes = await api.get(`/loyalty/rules/${regra.id}/customers`);
    setClientesRegra({ regra, clientes });
  }

  return (
    <div className="page">
      <h1>Regras de Fidelização</h1>
      <p className="subtitle">Defina quantas visitas geram desconto e qual o percentual.</p>

      <button className="btn btn-primary" onClick={() => setModalAberto(true)}>
        + Nova regra
      </button>

      <div className="card" style={{ marginTop: 16 }}>
        {carregando && <div>Carregando...</div>}
        {!carregando && regras.length === 0 && <div className="empty-state">Nenhuma regra cadastrada.</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Visitas necessárias</th>
              <th>Desconto</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {regras.map((r) => (
              <tr key={r.id}>
                <td>{r.visitas_necessarias}</td>
                <td>{r.percentual_desconto}%</td>
                <td>
                  <span className={`badge ${r.ativo ? 'badge-green' : 'badge-gray'}`}>
                    {r.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary" onClick={() => alternarAtiva(r)}>
                    {r.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => verClientes(r)}>
                    Ver clientes
                  </button>
                  <button className="btn btn-ghost" onClick={() => excluirRegra(r.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <Modal title="Nova regra de desconto" onClose={() => setModalAberto(false)}>
          <form onSubmit={criarRegra}>
            <div className="field">
              <label>Visitas necessárias</label>
              <input
                type="number"
                min={1}
                className="input"
                value={visitas}
                onChange={(e) => setVisitas(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Percentual de desconto (%)</label>
              <input
                type="number"
                min={1}
                step="0.5"
                className="input"
                value={percentual}
                onChange={(e) => setPercentual(e.target.value)}
              />
            </div>
            <button className="btn btn-primary btn-block">Criar regra</button>
          </form>
        </Modal>
      )}

      {clientesRegra && (
        <Modal
          title={`Clientes que atingiram ${clientesRegra.regra.visitas_necessarias} visitas`}
          onClose={() => setClientesRegra(null)}
        >
          {clientesRegra.clientes.length === 0 && <div className="empty-state">Nenhum cliente atingiu essa regra ainda.</div>}
          <table className="table">
            <tbody>
              {clientesRegra.clientes.map((c) => (
                <tr key={c.id}>
                  <td>{c.nome || c.email}</td>
                  <td>{c.total_visitas} visitas</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
}
