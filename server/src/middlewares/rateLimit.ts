import { rateLimit } from 'express-rate-limit';

// limit LLM calls per IP (free tier quota)
export const diagnosisLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many diagnoses in a short time. Please wait a minute.' }
});
