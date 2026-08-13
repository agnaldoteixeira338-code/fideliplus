import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';
import BarraNavegacao from './BarraNavegacao.jsx';

export default function RotaProtegida({ role }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="page">Carregando...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'dono' ? '/dono' : '/cliente'} replace />;

  return (
    <div className="app-shell">
      <BarraNavegacao />
      <Outlet />
    </div>
  );
}
