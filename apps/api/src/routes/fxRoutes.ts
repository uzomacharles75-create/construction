import express from 'express';
import { getFxRates } from '../services/fxService';

const router = express.Router();

// Public: live FX rates (base USD). Cached server-side for 1 hour.
router.get('/rates', async (_req, res) => {
  try {
    const data = await getFxRates();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(503).json({ message: 'FX rates unavailable', error: error.message });
  }
});

export default router;
