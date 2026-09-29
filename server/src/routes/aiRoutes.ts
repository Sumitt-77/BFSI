import { Router } from 'express';
import { AiController } from '../controllers/aiController';
import { validateBody } from '../middleware/validate';
import { AiAdviceSchema } from '../validators/financialValidators';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/financial-advice',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 40 }), // stricter limit for AI queries
  validateBody(AiAdviceSchema),
  AiController.getFinancialAdvice
);

export default router;
