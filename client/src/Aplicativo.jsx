import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexto/ContextoAutenticacao.jsx';
import { ToastProvider } from './contexto/ContextoNotificacoes.jsx';
import RotaProtegida from './componentes/RotaProtegida.jsx';

import Inicio from './paginas/Inicio.jsx';
import EntrarCliente from './paginas/EntrarCliente.jsx';

import PainelCliente from './paginas/cliente/PainelCliente.jsx';
import Fidelizacao from './paginas/cliente/Fidelizacao.jsx';
import Favoritos from './paginas/cliente/Favoritos.jsx';
import Saude from './paginas/cliente/Saude.jsx';
import Perfil from './paginas/cliente/Perfil.jsx';

import PainelDono from './paginas/dono/PainelDono.jsx';
import RegrasFidelizacao from './paginas/dono/RegrasFidelizacao.jsx';
import Clientes from './paginas/dono/Clientes.jsx';
import CheckIn from './paginas/dono/CheckIn.jsx';
import Relatorios from './paginas/dono/Relatorios.jsx';
import Configuracoes from './paginas/dono/Configuracoes.jsx';
import QrCodeAcesso from './paginas/dono/QrCodeAcesso.jsx';

export default function Aplicativo() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/entrar-cliente" element={<EntrarCliente />} />

            <Route path="/cliente" element={<RotaProtegida role="cliente" />}>
              <Route index element={<PainelCliente />} />
              <Route path="fidelizacao" element={<Fidelizacao />} />
              <Route path="favoritos" element={<Favoritos />} />
              <Route path="saude" element={<Saude />} />
              <Route path="perfil" element={<Perfil />} />
            </Route>

            <Route path="/dono" element={<RotaProtegida role="dono" />}>
              <Route index element={<PainelDono />} />
              <Route path="regras" element={<RegrasFidelizacao />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="checkin" element={<CheckIn />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="qrcode" element={<QrCodeAcesso />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
