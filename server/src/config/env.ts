import { z } from 'zod';

// Validate process.env once at startup: a missing secret crashes the server immediately
// with a clear message instead of failing later on the first request.
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(8080),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  DB_NAME: z.string().default('vehicle-diagnostics'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  MOCK_AI: z.enum(['0', '1']).default('1'),
  // Any OpenAI-compatible provider. Default: Google Gemini (free tier)
  AI_API_KEY: z.string().optional(),
  AI_BASE_URL: z.string().default('https://generativelanguage.googleapis.com/v1beta/openai/'),
  AI_MODEL: z.string().default('gemini-3.8-flash'),
  AI_JSON_MODE: z.enum(['schema', 'json_object']).default('schema'),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  DEMO_ERROR_TRIGGER: z.enum(['0', '1']).default('1')
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('\x1b[31mInvalid environment variables:\x1b[0m', z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isMockAI = env.MOCK_AI === '1';
export const allowedOrigins = env.CLIENT_ORIGIN.split(',')
  .map(origin => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);
