import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import { useToast } from '../contexto/ContextoNotificacoes.jsx';

export default function EntrarCliente() {
  const { loginAs } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const jaTentou = useRef(false);

  useEffect(() => {
    if (jaTentou.current) return;
    jaTentou.current = true;

    loginAs('cliente')
      .then(() => navigate('/cliente', { replace: true }))
      .catch((err) => {
        showToast(err.message, 'error');
        navigate('/', { replace: true });
      });
  }, []);

  return (
    <div className="home-screen">
      <div className="home-logo">
        <div className="mark">FIDELI+</div>
        <div className="tagline">Entrando automaticamente...</div>
      </div>
    </div>
  );
}
