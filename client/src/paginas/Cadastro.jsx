import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import { useToast } from '../contexto/ContextoNotificacoes.jsx';

const VAZIO = { cpf: '', celular: '', email: '', senha: '', confirmarSenha: '', role: 'cliente' };

export default function Cadastro() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(VAZIO);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.senha !== form.confirmarSenha) {
      showToast('A senha e a confirmação de senha não são iguais', 'error');
      return;
    }
    setEnviando(true);
    try {
      const user = await register(form);
      showToast('Cadastro realizado com sucesso!', 'success');
      navigate(user.role === 'dono' ? '/dono' : '/cliente');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="home-screen">
      <div className="home-logo">
        <div className="mark">FIDELI+</div>
        <div className="tagline">Crie sua conta</div>
      </div>
      <div className="home-card" style={{ maxWidth: 420 }}>
        <h2>Cadastro</h2>
        <p>Preencha seus dados para começar.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Você é</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="cliente">Cliente</option>
              <option value="dono">Dono de estabelecimento</option>
            </select>
          </div>
          <div className="field">
            <label>CPF</label>
            <input
              className="input"
              value={form.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })}
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div className="field">
            <label>Celular</label>
            <input
              className="input"
              value={form.celular}
              onChange={(e) => setForm({ ...form, celular: e.target.value })}
              placeholder="(11) 90000-0000"
              required
            />
          </div>
          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              className="input"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label>Confirmar senha</label>
            <input
              type="password"
              className="input"
              value={form.confirmarSenha}
              onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
              minLength={6}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 13, textAlign: 'center' }}>
          <Link to="/">Já tenho conta — entrar</Link>
        </div>
      </div>
    </div>
  );
}
