import { Router } from 'express';
import { LoanController } from '../controllers/loanController';
import { validateBody } from '../middleware/validate';
import { LoanEligibilitySchema } from '../validators/financialValidators';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/analyze',
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 120 }),
  validateBody(LoanEligibilitySchema),
  LoanController.analyzeEligibility
);

export default router;
