import { Router } from 'express';
import { RecordsController } from '../controllers/recordsController';
import { validateBody } from '../middleware/validate';
import { SaveRecordSchema } from '../validators/financialValidators';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }),
  validateBody(SaveRecordSchema),
  RecordsController.saveRecord
);

router.get(
  '/',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }),
  RecordsController.getRecords
);

router.get(
  '/:id',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }),
  RecordsController.getRecordById
);

export default router;
