import { Router } from 'express';
import {
  register,
  login,
  recuperarSenhaVerificar,
  recuperarSenhaRedefinir,
  me,
} from '../controladores/autenticacaoController.js';
import { requireAuth } from '../intermediarios/autenticacao.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recuperar-senha/verificar', recuperarSenhaVerificar);
router.post('/recuperar-senha/redefinir', recuperarSenhaRedefinir);
router.get('/me', requireAuth, me);

export default router;
