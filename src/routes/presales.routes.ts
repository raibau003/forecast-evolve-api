import { Router } from 'express';
import {
  getPresales,
  getPresaleById,
  createPresale,
  updatePresale,
  deletePresale,
  exportPresalesCSV
} from '../controllers/presalesController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de presales
router.get('/', getPresales);
router.get('/export/csv', exportPresalesCSV);
router.get('/:id', getPresaleById);
router.post('/', createPresale);
router.put('/:id', updatePresale);
router.delete('/:id', authorize('admin', 'presales'), deletePresale);

export default router;
