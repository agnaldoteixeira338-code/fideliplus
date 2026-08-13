import { Router } from 'express';
import {
  getMyHealthData,
  upsertMyHealthData,
  nearby,
  createRequest,
  myRequests,
  advanceRequestStatus,
  cancelRequest,
  healthReport,
} from '../controladores/saudeController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/data', requireAuth, requireRole('cliente'), getMyHealthData);
router.put('/data', requireAuth, requireRole('cliente'), upsertMyHealthData);
router.get('/nearby', requireAuth, requireRole('cliente'), nearby);
router.post('/requests', requireAuth, requireRole('cliente'), createRequest);
router.get('/requests', requireAuth, requireRole('cliente'), myRequests);
router.put('/requests/:id/advance', requireAuth, requireRole('cliente'), advanceRequestStatus);
router.put('/requests/:id/cancel', requireAuth, requireRole('cliente'), cancelRequest);
router.get('/report', requireAuth, requireRole('dono'), healthReport);

export default router;
