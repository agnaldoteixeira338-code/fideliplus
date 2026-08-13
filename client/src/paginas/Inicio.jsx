import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import { useToast } from '../contexto/ContextoNotificacoes.jsx';

export default function Inicio() {
  const { loginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  async function handleLogin(role) {
    setLoadingRole(role);
    try {
      const user = await loginAs(role);
      navigate(user.role === 'dono' ? '/dono' : '/cliente');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingRole(null);
    }
  }

  return (
    <div className="home-screen">
      <div className="home-logo">
        <div className="mark">FIDELI+</div>
        <div className="tagline">Fidelização inteligente para o seu negócio</div>
      </div>
      <div className="home-card">
        <h2>Acesso de testes</h2>
        <p>Ambiente de demonstração — escolha como deseja entrar, sem necessidade de senha.</p>
        <button className="btn btn-primary btn-block" disabled={!!loadingRole} onClick={() => handleLogin('cliente')}>
          {loadingRole === 'cliente' ? 'Entrando...' : 'Entrar como Cliente'}
        </button>
        <button className="btn btn-secondary btn-block" disabled={!!loadingRole} onClick={() => handleLogin('dono')}>
          {loadingRole === 'dono' ? 'Entrando...' : 'Entrar com Empresa'}
        </button>
      </div>
    </div>
  );
}
