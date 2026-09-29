import { Router } from 'express';
import { CreditController } from '../controllers/creditController';
import { validateBody } from '../middleware/validate';
import { CreditScoreSchema } from '../validators/financialValidators';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/analyze',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 120 }),
  validateBody(CreditScoreSchema),
  CreditController.analyzeCreditHealth
);

export default router;
