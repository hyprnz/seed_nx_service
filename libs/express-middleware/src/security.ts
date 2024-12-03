import { NextFunction, Request, Response } from 'express';

const securityMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.removeHeader('X-Powered-By');
    res.set({ 'X-Frame-Options': 'deny' });
    next();
};

export { securityMiddleware };
