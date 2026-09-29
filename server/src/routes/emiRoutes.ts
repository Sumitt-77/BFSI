import { Router } from 'express';
import { EmiController } from '../controllers/emiController';
import { validateBody } from '../middleware/validate';
import { EmiCalculationSchema } from '../validators/financialValidators';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/calculate',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 200 }),
  validateBody(EmiCalculationSchema),
  EmiController.calculateEmi
);

export default router;
