import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { FinancialRecord } from '../types';
import { ENV } from '../config/env';

const LOCAL_DATA_DIR = path.resolve(__dirname, '../../data');
const LOCAL_RECORDS_FILE = path.join(LOCAL_DATA_DIR, 'records.json');

export class GoogleSheetsService {
  private static ensureLocalStore() {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_RECORDS_FILE)) {
      fs.writeFileSync(LOCAL_RECORDS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  private static getSheetsClient() {
    if (!ENV.hasGoogleCredentials) {
      return null;
    }

    try {
      const auth = new google.auth.JWT({
        email: ENV.GOOGLE_CLIENT_EMAIL,
        key: ENV.GOOGLE_PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      return google.sheets({ version: 'v4', auth });
    } catch (err) {
      console.warn('Google Sheets authentication error:', err);
      return null;
    }
  }

  /**
   * Reads all financial records
   */
  public static async getRecords(): Promise<FinancialRecord[]> {
    this.ensureLocalStore();

    // 1. Try reading from Google Sheets if configured
    const sheets = this.getSheetsClient();
    if (sheets && ENV.GOOGLE_SHEET_ID) {
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: ENV.GOOGLE_SHEET_ID,
          range: 'Sheet1!A2:N', // row 1 is header
        });

        const rows = response.data.values || [];
        if (rows.length > 0) {
          const records: FinancialRecord[] = rows.map((row) => ({
            id: row[0] || '',
            timestamp: row[1] || '',
            age: Number(row[2]) || 0,
            employmentType: row[3] || '',
            monthlyIncome: Number(row[4]) || 0,
            monthlyExpenses: Number(row[5]) || 0,
            existingEmi: Number(row[6]) || 0,
            creditScore: Number(row[7]) || 0,
            loanAmount: Number(row[8]) || 0,
            loanTenure: Number(row[9]) || 0,
            estimatedEligibility: row[10] || '',
            dti: Number(row[11]) || 0,
            estimatedRisk: row[12] || '',
            aiSummary: row[13] || '',
          }));
          return records.reverse(); // newest first
        }
      } catch (err: any) {
        console.warn('Google Sheets read failed, falling back to persistent local storage:', err?.message || err);
      }
    }

    // 2. Read from local persistent file store
    try {
      const data = fs.readFileSync(LOCAL_RECORDS_FILE, 'utf-8');
      const records: FinancialRecord[] = JSON.parse(data);
      return records.reverse();
    } catch {
      return [];
    }
  }

  /**
   * Retrieves single record by ID
   */
  public static async getRecordById(id: string): Promise<FinancialRecord | null> {
    const records = await this.getRecords();
    return records.find((r) => r.id === id) || null;
  }

  /**
   * Appends record to Google Sheets and local store
   */
  public static async saveRecord(
    recordData: Omit<FinancialRecord, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): Promise<FinancialRecord> {
    this.ensureLocalStore();

    const record: FinancialRecord = {
      id: recordData.id || `FIN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: recordData.timestamp || new Date().toISOString(),
      name: recordData.name || 'Anonymous User',
      age: recordData.age,
      employmentType: recordData.employmentType,
      monthlyIncome: recordData.monthlyIncome,
      monthlyExpenses: recordData.monthlyExpenses,
      existingEmi: recordData.existingEmi,
      creditScore: recordData.creditScore,
      loanAmount: recordData.loanAmount,
      loanTenure: recordData.loanTenure,
      estimatedEligibility: recordData.estimatedEligibility,
      dti: recordData.dti,
      estimatedRisk: recordData.estimatedRisk,
      aiSummary: recordData.aiSummary || '',
    };

    // 1. Save to local store
    try {
      const raw = fs.readFileSync(LOCAL_RECORDS_FILE, 'utf-8');
      const list: FinancialRecord[] = JSON.parse(raw);
      list.push(record);
      fs.writeFileSync(LOCAL_RECORDS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving local record:', err);
    }

    // 2. Append to Google Sheets if configured
    const sheets = this.getSheetsClient();
    if (sheets && ENV.GOOGLE_SHEET_ID) {
      try {
        // Ensure header exists
        try {
          const headerCheck = await sheets.spreadsheets.values.get({
            spreadsheetId: ENV.GOOGLE_SHEET_ID,
            range: 'Sheet1!A1:N1',
          });
          if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
              spreadsheetId: ENV.GOOGLE_SHEET_ID,
              range: 'Sheet1!A1:N1',
              valueInputOption: 'RAW',
              requestBody: {
                values: [[
                  'Record ID',
                  'Timestamp',
                  'Age',
                  'Employment Type',
                  'Monthly Income',
                  'Monthly Expenses',
                  'Existing EMI',
                  'Credit Score',
                  'Loan Amount',
                  'Loan Tenure',
                  'Estimated Eligibility',
                  'DTI',
                  'Estimated Risk',
                  'AI Summary',
                ]],
              },
            });
          }
        } catch {
          // ignore header check error
        }

        const rowValues = [
          record.id,
          record.timestamp,
          record.age,
          record.employmentType,
          record.monthlyIncome,
          record.monthlyExpenses,
          record.existingEmi,
          record.creditScore,
          record.loanAmount,
          record.loanTenure,
          record.estimatedEligibility,
          record.dti,
          record.estimatedRisk,
          record.aiSummary || '',
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: ENV.GOOGLE_SHEET_ID,
          range: 'Sheet1!A:N',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [rowValues],
          },
        });
      } catch (err: any) {
        console.warn('Google Sheets append failed, stored locally instead:', err?.message || err);
      }
    }

    return record;
  }
}
