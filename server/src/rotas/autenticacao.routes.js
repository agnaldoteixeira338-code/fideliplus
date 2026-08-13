import { Router } from 'express';
import { demoLogin, me } from '../controladores/autenticacaoController.js';
import { requireAuth } from '../intermediarios/autenticacao.js';

const router = Router();

router.post('/demo-login', demoLogin);
router.get('/me', requireAuth, me);

export default router;
