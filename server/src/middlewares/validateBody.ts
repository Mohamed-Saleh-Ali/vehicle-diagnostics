import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { httpError } from './httpError.ts';

const validateBody =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map(issue => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
        .join('; ');
      next(httpError(400, message));
      return;
    }
    req.body = result.data;
    next();
  };

export default validateBody;
