import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '#config';
import { User } from '#models';
import { httpError } from '#middlewares';
import type { LoginDTO, RegisterDTO } from '#schemas';

type PublicUser = { id: string; name: string; email: string; role: 'technician' | 'admin' };
type AuthResponse = { token: string; user: PublicUser };

const signToken = (userId: string) =>
  jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  });

const toPublicUser = (user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: PublicUser['role'];
}): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

// POST /api/auth/register
// role is always technician here, admins are created by the seed script
export const register: RequestHandler<unknown, AuthResponse, RegisterDTO> = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) throw httpError(409, 'An account with this email already exists');

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hash, role: 'technician' });

  res.status(201).json({ token: signToken(user._id.toString()), user: toPublicUser(user) });
};

// POST /api/auth/login
// same error for unknown email and wrong password
export const login: RequestHandler<unknown, AuthResponse, LoginDTO> = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw httpError(401, 'Invalid email or password');
  }
  res.json({ token: signToken(user._id.toString()), user: toPublicUser(user) });
};

// GET /api/auth/me (used to restore the session on page reload)
export const me: RequestHandler<unknown, { user: PublicUser }> = (req, res) => {
  if (!req.user) throw httpError(401, 'Please log in');
  res.json({ user: req.user });
};
