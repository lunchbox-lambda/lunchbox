import { Request, Response, NextFunction } from 'express';

export default function apiVersioning() {
  return (req: Request, res: Response, next: NextFunction) => {
    Object.assign(req, { apiVersion: req.params.version });
    next();
  };
}
