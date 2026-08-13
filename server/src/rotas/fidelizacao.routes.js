import { Router } from 'express';
import {
  listRules,
  createRule,
  updateRule,
  deleteRule,
  ruleCustomers,
  myProgress,
  myProgressSummary,
} from '../controladores/fidelizacaoController.js';
import { checkin, establishmentVisits, myVisits } from '../controladores/visitasController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/rules', requireAuth, requireRole('dono'), listRules);
router.post('/rules', requireAuth, requireRole('dono'), createRule);
router.put('/rules/:id', requireAuth, requireRole('dono'), updateRule);
router.delete('/rules/:id', requireAuth, requireRole('dono'), deleteRule);
router.get('/rules/:id/customers', requireAuth, requireRole('dono'), ruleCustomers);

router.get('/my-progress', requireAuth, requireRole('cliente'), myProgress);
router.get('/my-progress-summary', requireAuth, requireRole('cliente'), myProgressSummary);

router.post('/checkin', requireAuth, requireRole('dono'), checkin);
router.get('/visits', requireAuth, requireRole('dono'), establishmentVisits);
router.get('/my-visits', requireAuth, requireRole('cliente'), myVisits);

export default router;
