import express from 'express';
import { getDocuments, uploadDocument, deleteDocument } from '../controllers/documentController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload'; // Multer middleware

const router = express.Router();

router.use(protect);

router.get('/', getDocuments);
router.post('/upload', upload.single('file'), uploadDocument);
router.delete('/:id', deleteDocument);
export default router;