import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import autenticacaoRoutes from './rotas/autenticacao.routes.js';
import estabelecimentosRoutes from './rotas/estabelecimentos.routes.js';
import fidelizacaoRoutes from './rotas/fidelizacao.routes.js';
import favoritosRoutes from './rotas/favoritos.routes.js';
import clientesRoutes from './rotas/clientes.routes.js';
import saudeRoutes from './rotas/saude.routes.js';
import painelRoutes from './rotas/painel.routes.js';
import relatoriosRoutes from './rotas/relatorios.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health-check', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', autenticacaoRoutes);
app.use('/api/establishments', estabelecimentosRoutes);
app.use('/api/loyalty', fidelizacaoRoutes);
app.use('/api/favorites', favoritosRoutes);
app.use('/api/customers', clientesRoutes);
app.use('/api/health', saudeRoutes);
app.use('/api/dashboard', painelRoutes);
app.use('/api/reports', relatoriosRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

export default app;
