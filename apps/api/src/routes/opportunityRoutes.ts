import express from 'express';
import {
  getOpportunities,
  ingestOpportunities,
} from '../controllers/opportunityController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

router.use(protect);

router.get('/', getOpportunities);
router.post('/ingest', authorize(['owner']), ingestOpportunities);

export default router;
