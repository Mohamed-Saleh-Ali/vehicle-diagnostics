import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '#config';
import { User } from '#models';
import { httpError } from './httpError.ts';

// Bearer token -> req.user
// user is loaded from the db so deleted users / role changes apply immediately
const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw httpError(401, 'Please log in');

  let userId: string;
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET);
    if (typeof payload === 'string' || !payload.sub) throw new Error('Malformed token');
    userId = payload.sub;
  } catch {
    throw httpError(401, 'Session expired, please log in again');
  }

  const user = await User.findById(userId);
  if (!user) throw httpError(401, 'Session expired, please log in again');

  req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  next();
};

export default authenticate;
