import express from 'express';
import { askAssistant } from '../controllers/aiController';
import { protect } from '../middleware/auth';
import { aiRateLimiter } from '../middleware/aiRateLimit';

const router = express.Router();

router.post('/chat', protect, aiRateLimiter, askAssistant);

export default router;