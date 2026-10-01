// req.user is set by the authenticate middleware
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: 'technician' | 'admin';
      };
    }
  }
}
