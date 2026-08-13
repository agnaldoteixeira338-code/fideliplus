import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexto/ContextoAutenticacao.jsx';

const ABAS_CLIENTE = [
  { to: '/cliente', label: 'Dashboard', end: true },
  { to: '/cliente/fidelizacao', label: 'Fidelização' },
  { to: '/cliente/favoritos', label: 'Favoritos' },
  { to: '/cliente/saude', label: 'Saúde' },
  { to: '/cliente/perfil', label: 'Perfil' },
];

const ABAS_DONO = [
  { to: '/dono', label: 'Dashboard', end: true },
  { to: '/dono/regras', label: 'Fidelização' },
  { to: '/dono/clientes', label: 'Clientes' },
  { to: '/dono/checkin', label: 'Check-in' },
  { to: '/dono/qrcode', label: 'QR Code' },
  { to: '/dono/relatorios', label: 'Relatórios' },
  { to: '/dono/configuracoes', label: 'Configurações' },
];

export default function BarraNavegacao() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const abas = user.role === 'dono' ? ABAS_DONO : ABAS_CLIENTE;

  return (
    <>
      <div className="topbar">
        <div className="brand">
          FIDELI+
          <span>{user.role === 'dono' ? 'Painel do Dono' : 'Área do Cliente'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="user-chip">{user.nome || user.email}</div>
          <button className="logout-btn" onClick={logout}>
            Sair
          </button>
        </div>
      </div>
      <div className="tabbar">
        {abas.map((aba) => (
          <NavLink key={aba.to} to={aba.to} end={aba.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            {aba.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
