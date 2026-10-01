import { Router } from 'express';
import { login, me, register } from '#controllers';
import { authenticate, validateBody } from '#middlewares';
import { loginSchema, registerSchema } from '#schemas';

const authRouter = Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.get('/me', authenticate, me);

export default authRouter;
