import { Response } from 'express';
import BOQ from '../models/BOQ';
import Project from '../models/Project'; // CRITICAL: Added missing import

/**
 * @desc    Get all BOQs for the company (Dashboard view)
 * @route   GET /api/v1/boq
 */
export const getBOQs = async (req: any, res: Response) => {
  try {
    const boqs = await BOQ.find({ company: req.user.companyId })
      .populate('project', 'name location')
      .sort({ updatedAt: -1 });
    res.status(200).json(boqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company BOQs" });
  }
};

/**
 * @desc    Get a specific BOQ for a project
 * @route   GET /api/v1/boq/project/:projectId
 */
export const getBOQByProject = async (req: any, res: Response) => {
  try {
    const { projectId } = req.params;
    const boq = await BOQ.findOne({ 
      project: projectId, 
      company: req.user.companyId 
    }).populate('project');

    if (!boq) return res.status(404).json({ message: "No BOQ found for this project" });
    
    res.status(200).json(boq);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving project BOQ" });
  }
};

/**
 * @desc    Add item to BOQ
 * @route   POST /api/v1/boq/project/:projectId/item
 */
export const addBOQItem = async (req: any, res: Response) => {
  try {
    const { projectId } = req.params;
    const { description, unit, qty, rate, source } = req.body;
    const companyId = req.user.companyId;

    const project = await Project.findOne({ _id: projectId, company: companyId });
    if (!project) return res.status(404).json({ message: "Project not found" });

    let boq = await BOQ.findOne({ project: projectId, company: companyId });

    if (!boq) {
      boq = new BOQ({ project: projectId, company: companyId, items: [] });
    }

    if (boq.isLocked) {
      return res.status(403).json({ message: "BOQ is locked for verification." });
    }

    boq.items.push({
      description,
      unit,
      qty: Number(qty),
      rate: Number(rate),
      source: source || 'user',
      status: 'pending'
    });

    await boq.save(); // Triggers total calculation in model
    res.status(201).json({ message: "Item added", data: boq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify a specific BOQ item (Verification-First Logic)
 * @route   PUT /api/v1/boq/verify/:itemId
 */
export const verifyItem = async (req: any, res: Response) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body; // 'verified' or 'rejected'

    const boq = await BOQ.findOneAndUpdate(
      { "items._id": itemId, company: req.user.companyId },
      { $set: { "items.$.status": status } },
      { new: true }
    );

    if (!boq) return res.status(404).json({ message: "Item not found" });

    // Re-save to trigger the totalAmount and isLocked calculation in the pre-save hook
    await boq.save();

    res.status(200).json({ message: `Item marked as ${status}`, boq });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};