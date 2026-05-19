import express from 'express';
import { getPendingCompanies, verifyCompany, getSettings, updateSettings,
    getAnalytics, getGlobalStats, getActivityLogs, getAllCompanies } from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

// All routes here require login AND the 'admin' role
router.use(protect);
router.use(authorize(['admin']));

router.get('/pending', getPendingCompanies);
router.put('/verify/:id', verifyCompany);
router.get('/stats', getGlobalStats);
router.get('/activity', getActivityLogs); 
router.get('/companies', getAllCompanies); 
router.get('/analytics', getAnalytics); 
router.get('/settings', getSettings);
router.put('/settings', updateSettings)

export default router;