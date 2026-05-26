import express from 'express';
import { createProject, getCompanyProjects } from '../controllers/projectController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/', protect, getCompanyProjects);

export default router;