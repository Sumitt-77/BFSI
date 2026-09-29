import { Request, Response, NextFunction } from 'express';
import { EligibilityService } from '../services/eligibilityService';
import { LoanEligibilityInput } from '../types';

export class LoanController {
  public static analyzeEligibility(req: Request, res: Response, next: NextFunction): void {
    try {
      const input: LoanEligibilityInput = req.body;
      const result = EligibilityService.evaluateEligibility(input);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
