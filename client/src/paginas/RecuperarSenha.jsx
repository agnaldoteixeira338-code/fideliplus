import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/requisicoes.js';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import { useToast } from '../contexto/ContextoNotificacoes.jsx';

export default function RecuperarSenha() {
  const { redefinirSenha } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function verificar(e) {
    e.preventDefault();
    setEnviando(true);
    try {
      const { resetToken: token } = await api.post('/auth/recuperar-senha/verificar', { email, celular });
      setResetToken(token);
      showToast('Dados confirmados! Defina sua nova senha.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEnviando(false);
    }
  }

  async function redefinir(e) {
    e.preventDefault();
    if (novaSenha !== confirmarNovaSenha) {
      showToast('A senha e a confirmação de senha não são iguais', 'error');
      return;
    }
    setEnviando(true);
    try {
      const user = await redefinirSenha(resetToken, novaSenha, confirmarNovaSenha);
      showToast('Senha redefinida com sucesso!', 'success');
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
        <div className="tagline">Recuperar senha</div>
      </div>
      <div className="home-card">
        {!resetToken ? (
          <>
            <h2>Confirme seus dados</h2>
            <p>Informe o e-mail e o celular cadastrados na sua conta.</p>
            <form onSubmit={verificar}>
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
                <label>Celular</label>
                <input
                  className="input"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  placeholder="(11) 90000-0000"
                  required
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={enviando}>
                {enviando ? 'Verificando...' : 'Continuar'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2>Nova senha</h2>
            <p>Dados confirmados. Escolha sua nova senha.</p>
            <form onSubmit={redefinir}>
              <div className="field">
                <label>Nova senha</label>
                <input
                  type="password"
                  className="input"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div className="field">
                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  className="input"
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={enviando}>
                {enviando ? 'Salvando...' : 'Redefinir senha'}
              </button>
            </form>
          </>
        )}
        <div style={{ marginTop: 16, fontSize: 13, textAlign: 'center' }}>
          <Link to="/">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}
