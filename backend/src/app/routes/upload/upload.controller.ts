import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import auth from '../auth/auth';
import { uploadToS3 } from '../../../s3';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/upload', auth.required, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const key = `avatars/${uuidv4()}-${req.file.originalname}`;
    const url = await uploadToS3(req.file.buffer, key, req.file.mimetype);
    res.json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
