import express from 'express';
// 1. Import your named exports from the controller
import { register, login, getSummary, getCompanyBySlug, getMyCompanyProfile, updateCompanyBySlug,
updateCompanyPortfolio, updateCompanyLogo, deleteCompanyPortfolioImage, updateMyCompanyProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { handleUpload } from '../middleware/handleUpload';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Atomic registration (Creates Owner + Company Profile)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login and return JWT token + User/Company metadata
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/v1/auth/company/summary
 * @desc    Get dashboard summary stats for the company
 * @access  Private
 */
router.get('/company/summary', protect, getSummary);

/**
 * @route   PUT /api/v1/auth/company/:id
 * @desc    Update company business profile
 * @access  Private
 */
router.get('/company/profile', protect, getMyCompanyProfile);
router.put('/company/profile', protect, updateMyCompanyProfile);
router.get('/company/:slug', protect, getCompanyBySlug);
router.put('/company/:slug', protect, updateCompanyBySlug);
router.post('/company/:slug/logo', protect, handleUpload(upload.single('file')), updateCompanyLogo);
router.post('/company/:slug/gallery', protect, handleUpload(upload.array('files', 10)), updateCompanyPortfolio);
router.delete('/company/:slug/gallery', protect, deleteCompanyPortfolioImage);

export default router;