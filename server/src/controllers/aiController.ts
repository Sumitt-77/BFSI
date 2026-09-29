import { Request, Response, NextFunction } from 'express';
import { ClaudeAiService } from '../services/claudeAiService';
import { AiFinancialAdviceInput } from '../types';

export class AiController {
  public static async getFinancialAdvice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: AiFinancialAdviceInput = req.body;
      const advice = await ClaudeAiService.generateFinancialAdvice(input);
      res.status(200).json({
        success: true,
        data: advice,
      });
    } catch (err) {
      next(err);
    }
  }
}
