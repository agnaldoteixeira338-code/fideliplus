import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import { useToast } from '../contexto/ContextoNotificacoes.jsx';

export default function Inicio() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEntrando(true);
    try {
      const user = await login(email, senha);
      navigate(user.role === 'dono' ? '/dono' : '/cliente');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="home-screen">
      <div className="home-logo">
        <div className="mark">FIDELI+</div>
        <div className="tagline">Fidelização inteligente para o seu negócio</div>
      </div>
      <div className="home-card">
        <h2>Entrar</h2>
        <p>Acesse com seu e-mail e senha.</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>E-mail</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary btn-block" disabled={entrando}>
            {entrando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
          <Link to="/cadastro">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
