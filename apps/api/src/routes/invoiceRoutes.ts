import express from 'express';
// 1. Double check these names match the controller
import { createInvoice, getInvoices, getInvoiceById } from '../controllers/invoiceController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

router.use(protect);
router.use(authorize(['owner', 'admin']));

// 2. If any of these are 'undefined', the app crashes with that error
router.post('/', createInvoice); 
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);

export default router;