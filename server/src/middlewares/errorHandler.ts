import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { env } from '#config';

const hasStatus = (value: unknown): value is { status: number } =>
  typeof value === 'object' && value !== null && 'status' in value && typeof value.status === 'number';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (env.NODE_ENV !== 'production') console.error(`\x1b[31m${err instanceof Error ? err.stack : err}\x1b[0m`);

  // invalid ObjectId, e.g. /api/parts/123
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid ${err.path}` });
    return;
  }
  // duplicate key (unique index)
  if (typeof err === 'object' && err !== null && 'code' in err && err.code === 11000) {
    const field = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0];
    const label = field === 'partNumber' ? 'This part number' : field === 'email' ? 'This email' : 'This value';
    res.status(409).json({ message: `${label} already exists` });
    return;
  }
  // errors created with httpError()
  if (err instanceof Error && hasStatus(err.cause)) {
    res.status(err.cause.status).json({ message: err.message });
    return;
  }
  // express errors, e.g. malformed JSON body
  if (hasStatus(err) && err.status < 500) {
    res.status(err.status).json({ message: err instanceof Error ? err.message : 'Bad request' });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
