import type { RequestHandler } from 'express';
import { httpError } from './httpError.ts';

const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(httpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundHandler;
