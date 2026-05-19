import express from 'express';
import { 
  getBOQs, 
  getBOQByProject, 
  addBOQItem, 
  verifyItem 
} from '../controllers/boqController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

router.use(protect);

// 1. GET ALL BOQs (Matches frontend call: GET /api/v1/boq)
// Fixes the 404 error on the main dashboard/BOQ page
router.get('/', getBOQs);

// 2. GET SPECIFIC BOQ
router.get('/project/:projectId', getBOQByProject);

// 3. ADD ITEM
router.post(
  '/project/:projectId/item', 
  authorize(['owner', 'staff']), 
  addBOQItem
);

// 4. VERIFY ITEM
router.put(
  '/verify/:itemId', 
  authorize(['owner', 'staff']), 
  verifyItem
);

export default router;