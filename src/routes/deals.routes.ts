import { Router } from 'express';
import dealsController from '../controllers/deals.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', dealsController.getAll);
router.get('/stats', dealsController.getStats);
router.get('/export', dealsController.export);
router.get('/:id', dealsController.getById);
router.post('/', dealsController.create);
router.patch('/:id', dealsController.update);
router.delete('/:id', authorize('admin', 'seller'), dealsController.delete);

export default router;
