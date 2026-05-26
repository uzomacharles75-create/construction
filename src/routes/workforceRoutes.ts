import express from 'express';
import { getCompanyWorkers, addWorker } from '../controllers/workforceController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

router.get('/', protect, authorize(['owner', 'admin']), getCompanyWorkers);
router.post('/', protect, authorize(['owner']), addWorker);

export default router;