import { Router } from 'express';
import {
  listMyFavorites,
  addFavorite,
  removeFavorite,
  establishmentFavoritedBy,
} from '../controladores/favoritosController.js';
import { requireAuth, requireRole } from '../intermediarios/autenticacao.js';

const router = Router();

router.get('/', requireAuth, requireRole('cliente'), listMyFavorites);
router.post('/', requireAuth, requireRole('cliente'), addFavorite);
router.delete('/:establishmentId', requireAuth, requireRole('cliente'), removeFavorite);
router.get('/establishment/:id', requireAuth, requireRole('dono'), establishmentFavoritedBy);

export default router;
