import { Router } from 'express';
import { listCustomers, getCustomer, sendPromoMessage } from '../controladores/clientesController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/', requireAuth, requireRole('dono'), listCustomers);
router.get('/:id', requireAuth, requireRole('dono'), getCustomer);
router.post('/message', requireAuth, requireRole('dono'), sendPromoMessage);

export default router;
