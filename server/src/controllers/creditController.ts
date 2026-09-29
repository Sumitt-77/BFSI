import { Request, Response, NextFunction } from 'express';
import { CreditService } from '../services/creditService';
import { CreditScoreInput } from '../types';

export class CreditController {
  public static analyzeCreditHealth(req: Request, res: Response, next: NextFunction): void {
    try {
      const input: CreditScoreInput = req.body;
      const result = CreditService.analyzeCredit(input);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
