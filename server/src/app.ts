import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { allowedOrigins, env } from '#config';
import { connectDB } from '#db';
import { authRouter, partsRouter } from '#routes';
import { errorHandler, notFoundHandler } from '#middlewares';
import { openapiDoc } from '#docs';

const app = express();

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/parts', partsRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use(notFoundHandler);
app.use(errorHandler);

await connectDB();
app.listen(env.PORT, () => {
  console.log(`\x1b[34mAPI running on http://localhost:${env.PORT}\x1b[0m`);
});
