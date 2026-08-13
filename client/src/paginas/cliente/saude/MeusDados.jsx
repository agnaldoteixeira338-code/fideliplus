import { useEffect, useState } from 'react';
import { api } from '../../../api/requisicoes.js';
import { useToast } from '../../../contexto/ContextoNotificacoes.jsx';

const VAZIO = { plano_nome: '', carteirinha: '', validade: '', alergias: '', condicoes_especiais: '' };

export default function MeusDados() {
  const [form, setForm] = useState(VAZIO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api
      .get('/health/data')
      .then((data) => {
        if (data) {
          setForm({
            plano_nome: data.plano_nome || '',
            carteirinha: data.carteirinha || '',
            validade: data.validade ? data.validade.slice(0, 10) : '',
            alergias: data.alergias || '',
            condicoes_especiais: data.condicoes_especiais || '',
          });
        }
      })
      .finally(() => setCarregando(false));
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.put('/health/data', form);
      showToast('Dados de saúde salvos!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <div className="card">Carregando...</div>;

  return (
    <form className="card" onSubmit={salvar}>
      <h3>Meu plano de saúde</h3>
      <div className="grid cols-2">
        <div className="field">
          <label>Nome do plano</label>
          <input
            className="input"
            value={form.plano_nome}
            onChange={(e) => setForm({ ...form, plano_nome: e.target.value })}
            placeholder="Ex: Amil, Unimed..."
          />
        </div>
        <div className="field">
          <label>Número da carteirinha</label>
          <input
            className="input"
            value={form.carteirinha}
            onChange={(e) => setForm({ ...form, carteirinha: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Validade</label>
          <input
            type="date"
            className="input"
            value={form.validade}
            onChange={(e) => setForm({ ...form, validade: e.target.value })}
          />
        </div>
      </div>
      <div className="field">
        <label>Alergias</label>
        <textarea
          className="input"
          rows={2}
          value={form.alergias}
          onChange={(e) => setForm({ ...form, alergias: e.target.value })}
        />
      </div>
      <div className="field">
        <label>Condições especiais</label>
        <textarea
          className="input"
          rows={2}
          value={form.condicoes_especiais}
          onChange={(e) => setForm({ ...form, condicoes_especiais: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" disabled={salvando}>
        {salvando ? 'Salvando...' : 'Salvar dados'}
      </button>
    </form>
  );
}
