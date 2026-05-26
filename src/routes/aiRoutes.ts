import express from 'express';
import { askAssistant } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/chat', protect, askAssistant);

export default router;