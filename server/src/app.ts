import express from 'express';
import { env } from '#config';
import { connectDB } from '#db';

const app = express();

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

await connectDB();
app.listen(env.PORT, () => {
  console.log(`\x1b[34mAPI running on http://localhost:${env.PORT}\x1b[0m`);
});
