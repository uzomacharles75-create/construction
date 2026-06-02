import express from 'express';
import { getOverview } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.get('/overview', getOverview);

export default router;
