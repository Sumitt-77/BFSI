import express, { Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import loanRoutes from './routes/loanRoutes';
import creditRoutes from './routes/creditRoutes';
import emiRoutes from './routes/emiRoutes';
import aiRoutes from './routes/aiRoutes';
import recordsRoutes from './routes/recordsRoutes';

const app = express();

// Security Headers Middleware
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev ports, configured CORS origin, or requests without origin (like curl)
      if (!origin || origin.startsWith('http://localhost') || origin === ENV.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for preview/vercel environments
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser with size safety
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    integrations: {
      anthropicAi: ENV.hasAnthropicKey ? 'configured' : 'algorithmic_fallback_active',
      googleSheets: ENV.hasGoogleCredentials ? 'configured' : 'local_storage_fallback_active',
    },
  });
});

// Mount API Modules
app.use('/api/loan', loanRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/emi', emiRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/records', recordsRoutes);

// Fallback 404 for unknown API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `API route ${req.method} ${req.originalUrl} not found.`,
    },
  });
});

// Centralized error middleware
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`[FinAI Server] Listening securely on port ${ENV.PORT}`);
    console.log(`[FinAI Server] Anthropic Claude: ${ENV.hasAnthropicKey ? 'Connected' : 'Algorithmic Mode'}`);
    console.log(`[FinAI Server] Google Sheets: ${ENV.hasGoogleCredentials ? 'Connected' : 'Local Storage Mode'}`);
  });
}

export default app;
