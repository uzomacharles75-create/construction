import express from 'express';
import { protect } from '../middleware/auth';
import Company from '../models/Company';
import User from '../models/User';

const router = express.Router();

// GET /wallet/balance
router.get('/balance', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    const company = user?.company as any;
    res.json({ balance: company?.walletBalance ?? 0 });
  } catch {
    res.status(500).json({ message: 'Failed to fetch balance.' });
  }
});

// POST /wallet/topup
router.post('/topup', protect, async (req: any, res) => {
  try {
    const { amount, note } = req.body;
    if (!amount || amount < 1000) return res.status(400).json({ message: 'Minimum top-up is 1,000 XAF.' });

    const user = await User.findById(req.user.id).populate('company');
    const companyDoc = user?.company as any;
    if (!companyDoc) return res.status(404).json({ message: 'Company not found.' });

    // Increment wallet balance — in production this would be gated behind payment confirmation
    await Company.findByIdAndUpdate(companyDoc._id, {
      $inc: { walletBalance: amount },
      $push: {
        walletHistory: {
          type: 'credit',
          amount,
          note: note || 'Manual top-up',
          date: new Date(),
        }
      }
    });

    res.json({ message: 'Wallet topped up.', amount });
  } catch {
    res.status(500).json({ message: 'Top-up failed.' });
  }
});

export default router;
