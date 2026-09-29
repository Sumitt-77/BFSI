import { Request, Response, NextFunction } from 'express';
import { GoogleSheetsService } from '../services/googleSheetsService';

export class RecordsController {
  public static async saveRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await GoogleSheetsService.saveRecord(req.body);
      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getRecords(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await GoogleSheetsService.getRecords();
      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const record = await GoogleSheetsService.getRecordById(id);
      if (!record) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Financial record with ID '${id}' was not found.`,
          },
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: record,
      });
    } catch (err) {
      next(err);
    }
  }
}
