import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { allowedOrigins, env, isMockAI } from '#config';
import { connectDB } from '#db';
import { authRouter, diagnosesRouter, partsRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';
import { openapiDoc } from '#docs';

const app = express();

app.set('trust proxy', 1); // behind render proxy
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mockAI: isMockAI, time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/parts', partsRouter);
app.use('/api/diagnoses', diagnosesRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use(notFoundHandler);
app.use(errorHandler);

await connectDB();
app.listen(env.PORT, () => {
  console.log(`\x1b[34mAPI running on http://localhost:${env.PORT} (AI: ${isMockAI ? 'MOCK' : env.AI_MODEL})\x1b[0m`);
});
