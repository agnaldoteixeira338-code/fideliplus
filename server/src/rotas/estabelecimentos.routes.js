import { Router } from 'express';
import {
  listEstablishments,
  getEstablishment,
  getMyEstablishment,
  updateMyEstablishment,
} from '../controladores/estabelecimentosController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/', requireAuth, listEstablishments);
router.get('/mine', requireAuth, requireRole('dono'), getMyEstablishment);
router.put('/mine', requireAuth, requireRole('dono'), updateMyEstablishment);
router.get('/:id', requireAuth, getEstablishment);

export default router;
