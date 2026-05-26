import express from 'express';
import { 
  getProducts, 
  createOrder, 
  getOrders, 
  getMarketplaceStats, 
  addProduct 
} from '../controllers/marketplaceController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/roleCheck';

const router = express.Router();

// Public: Browse
router.get('/products', getProducts);

// Protected: Orders & Stats
router.use(protect); // All routes below require login
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.get('/stats', getMarketplaceStats);

// Admin Only: Catalog management
router.post('/products', authorize(['admin']), addProduct);

export default router;