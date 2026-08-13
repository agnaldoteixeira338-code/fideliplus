import { useEffect, useState } from 'react';
import { api } from '../../api/requisicoes.js';
import { useToast } from '../../contexto/ContextoNotificacoes.jsx';

const VAZIO = {
  nome: '',
  endereco: '',
  cidade: '',
  estado: '',
  telefone: '',
  logo_url: '',
  hora_abertura: '',
  hora_fechamento: '',
  saude_parceiro: false,
};

export default function Configuracoes() {
  const [form, setForm] = useState(VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get('/establishments/mine')
      .then((e) =>
        setForm({
          nome: e.nome || '',
          endereco: e.endereco || '',
          cidade: e.cidade || '',
          estado: e.estado || '',
          telefone: e.telefone || '',
          logo_url: e.logo_url || '',
          hora_abertura: e.hora_abertura || '',
          hora_fechamento: e.hora_fechamento || '',
          saude_parceiro: e.saude_parceiro,
        })
      )
      .finally(() => setCarregando(false));
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.put('/establishments/mine', form);
      showToast('Configurações salvas!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <div className="page">Carregando...</div>;

  return (
    <div className="page">
      <h1>Configurações do Estabelecimento</h1>

      <form className="card" onSubmit={salvar}>
        <div className="grid cols-2">
          <div className="field">
            <label>Nome</label>
            <input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="field">
            <label>Telefone</label>
            <input
              className="input"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Endereço</label>
            <input
              className="input"
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Cidade</label>
            <input
              className="input"
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Estado (UF)</label>
            <input
              className="input"
              maxLength={2}
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value.toUpperCase() })}
            />
          </div>
          <div className="field">
            <label>URL do logotipo</label>
            <input
              className="input"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Horário de abertura</label>
            <input
              type="time"
              className="input"
              value={form.hora_abertura}
              onChange={(e) => setForm({ ...form, hora_abertura: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Horário de fechamento</label>
            <input
              type="time"
              className="input"
              value={form.hora_fechamento}
              onChange={(e) => setForm({ ...form, hora_fechamento: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.saude_parceiro}
              onChange={(e) => setForm({ ...form, saude_parceiro: e.target.checked })}
            />
            Estabelecimento parceiro de plano de saúde (ativa o módulo de Saúde para os clientes)
          </label>
        </div>

        <button className="btn btn-primary" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar configurações'}
        </button>
      </form>
    </div>
  );
}
