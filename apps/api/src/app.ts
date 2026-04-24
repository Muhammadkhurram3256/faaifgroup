import express, { type Application, type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import inquiriesRouter from './routes/inquiries';
import healthRouter from './routes/health';

interface AppOptions {
  disableRateLimit?: boolean;
}

export function createApp(opts: AppOptions = {}): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
    })
  );

  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));

  const passthroughLimiter: RequestHandler = (_req, _res, next) => {
    next();
  };

  const inquiryLimiter: RequestHandler = opts.disableRateLimit
    ? passthroughLimiter
    : rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 5,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests. Please try again later.' },
      });

  app.use('/api/health', healthRouter);
  app.use('/api/inquiries', inquiryLimiter, inquiriesRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
