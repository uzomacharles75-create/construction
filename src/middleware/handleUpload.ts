import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

type MulterHandler = (req: Request, res: Response, cb: (error?: unknown) => void) => void;

export const handleUpload = (uploadMiddleware: MulterHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }

      const message = err instanceof Error ? err.message : 'File upload failed';
      return res.status(400).json({ message });
    });
  };
};
