import { Response } from 'express';
import Worker from '../models/Worker';

export const addWorker = async (req: any, res: Response) => {
  try {
    const worker = new Worker({
      ...req.body,
      company: req.user.companyId
    });
    await worker.save();
    res.status(201).json(worker);
  } catch (error) {
    res.status(500).json({ message: "Failed to add worker" });
  }
};

export const getCompanyWorkers = async (req: any, res: Response) => {
  const workers = await Worker.find({ company: req.user.companyId });
  res.status(200).json(workers);
};