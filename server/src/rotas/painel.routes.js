import { Router } from 'express';
import { ownerDashboard, clientDashboard } from '../controladores/painelController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/owner', requireAuth, requireRole('dono'), ownerDashboard);
router.get('/client', requireAuth, requireRole('cliente'), clientDashboard);

export default router;
