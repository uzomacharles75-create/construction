import express from 'express';
import { protect } from '../middleware/auth';
import Service from '../models/Service';
import User from '../models/User';

const router = express.Router();

// GET /services — list services for the current company
router.get('/', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    const companyId = (user?.company as any)?._id || user?.company;
    const services = await Service.find({ company: companyId }).sort({ createdAt: -1 });
    res.json(services);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

// GET /services/public/:companyId — public listing for directory profile
router.get('/public/:companyId', async (req, res) => {
  try {
    const services = await Service.find({ company: req.params.companyId, isPublic: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch public services.' });
  }
});

// POST /services — create a service
router.post('/', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).populate('company');
    const companyId = (user?.company as any)?._id || user?.company;
    const service = new Service({ ...req.body, company: companyId });
    await service.save();
    res.status(201).json(service);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create service.' });
  }
});

// PUT /services/:id — update a service
router.put('/:id', protect, async (req: any, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update service.' });
  }
});

// DELETE /services/:id
router.delete('/:id', protect, async (req: any, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed.' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete service.' });
  }
});

export default router;
