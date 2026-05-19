import express from 'express';
import { 
  getConversations, 
  getMessages, 
  sendMessage 
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All messaging routes require a valid JWT
router.use(protect);

// 1. Get the sidebar list of chats
router.get('/conversations', getConversations);

// 2. Get history for a specific chat
router.get('/:chatId', getMessages);

// 3. Save a new message
router.post('/', sendMessage);

export default router;