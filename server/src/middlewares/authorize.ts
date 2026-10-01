import type { RequestHandler } from 'express';
import type { Role } from '#config';
import { httpError } from './httpError.ts';

// Use after authenticate: authorize('admin')
const authorize =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(httpError(401, 'Please log in'));
    if (!roles.includes(req.user.role)) return next(httpError(403, 'You are not allowed to do this'));
    next();
  };

export default authorize;
