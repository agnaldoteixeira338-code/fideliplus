import { Router } from 'express';
import { loyaltyReport, healthReportExport } from '../controladores/relatoriosController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/loyalty', requireAuth, requireRole('dono'), loyaltyReport);
router.get('/health', requireAuth, requireRole('dono'), healthReportExport);

export default router;
