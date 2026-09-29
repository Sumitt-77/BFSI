import { Request, Response, NextFunction } from 'express';
import { EmiService } from '../services/emiService';
import { EmiCalculationInput } from '../types';

export class EmiController {
  public static calculateEmi(req: Request, res: Response, next: NextFunction): void {
    try {
      const input: EmiCalculationInput = req.body;
      const result = EmiService.calculateEmi(input);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
