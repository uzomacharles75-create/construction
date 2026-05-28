import express from 'express';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { handleUpload } from '../middleware/handleUpload';
import Service from '../models/Service';
import User from '../models/User';

const router = express.Router();

async function getCompanyId(userId: string) {
  const user = await User.findById(userId).populate('company');
  return (user?.company as { _id?: unknown })?._id || user?.company;
}

function parseServiceBody(body: Record<string, unknown>) {
  const payload: Record<string, unknown> = {
    name: body.name,
    category: body.category,
    description: body.description ?? '',
    unit: body.unit || 'project',
    isPublic: body.isPublic === true || body.isPublic === 'true',
  };
  if (body.priceFrom !== undefined && body.priceFrom !== '') {
    payload.priceFrom = Number(body.priceFrom);
  }
  if (body.priceTo !== undefined && body.priceTo !== '') {
    payload.priceTo = Number(body.priceTo);
  }
  return payload;
}

// GET /services — list services for the current company
router.get('/', protect, async (req: any, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const services = await Service.find({ company: companyId }).sort({ createdAt: -1 });
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

// GET /services/public/:companyId — public listing for directory profile
router.get('/public/:companyId', async (req, res) => {
  try {
    const services = await Service.find({ company: req.params.companyId, isPublic: true })
      .sort({ createdAt: -1 })
      .select('name category description image priceFrom priceTo unit createdAt');
    res.json(services);
  } catch {
    res.status(500).json({ message: 'Failed to fetch public services.' });
  }
});

// POST /services — create a service (optional image file)
router.post('/', protect, handleUpload(upload.single('file')), async (req: any, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    if (!req.body.name || !req.body.category) {
      return res.status(400).json({ message: 'Name and category are required.' });
    }
    const payload = parseServiceBody(req.body);
    if (req.file?.path) payload.image = req.file.path;

    const service = new Service({ ...payload, company: companyId });
    await service.save();
    res.status(201).json(service);
  } catch {
    res.status(500).json({ message: 'Failed to create service.' });
  }
});

// POST /services/:id/image — upload or replace service image
router.post('/:id/image', protect, handleUpload(upload.single('file')), async (req: any, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided.' });

    const companyId = await getCompanyId(req.user.id);
    const service = await Service.findOne({ _id: req.params.id, company: companyId });
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    service.image = req.file.path;
    await service.save();
    res.json(service);
  } catch {
    res.status(500).json({ message: 'Failed to upload service image.' });
  }
});

// PUT /services/:id — update a service
router.put('/:id', protect, async (req: any, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const payload = parseServiceBody(req.body);
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, company: companyId },
      payload,
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json(service);
  } catch {
    res.status(500).json({ message: 'Failed to update service.' });
  }
});

// DELETE /services/:id
router.delete('/:id', protect, async (req: any, res) => {
  try {
    const companyId = await getCompanyId(req.user.id);
    const service = await Service.findOneAndDelete({ _id: req.params.id, company: companyId });
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    res.json({ message: 'Service removed.' });
  } catch {
    res.status(500).json({ message: 'Failed to delete service.' });
  }
});

export default router;
