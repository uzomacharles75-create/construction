import { Response } from 'express';
import BOQ from '../models/BOQ';
import Project from '../models/Project'; // CRITICAL: Added missing import
import { suggestBOQRate, analyzeBOQ } from '../services/aiService';
import { getVatRate } from '../utils/taxRates';
import { sanitizePrompt } from '../utils/promptGuard';
import Product from '../models/Product';

/**
 * Find marketplace products relevant to a free-text item description.
 * Builds a keyword regex from the significant words and ranks in-stock first.
 */
const findMarketplaceMatches = async (description: string) => {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (!words.length) return [];

  const regex = new RegExp(words.join('|'), 'i');
  const matches = await Product.find({
    $or: [{ name: regex }, { category: regex }, { description: regex }],
  })
    .sort({ inStock: -1 })
    .limit(5)
    .lean();

  return matches.map((p: any) => ({
    name: p.name,
    price: p.price,
    unit: p.unit,
    supplier: p.supplier,
    category: p.category,
  }));
};

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
    const { description, unit, qty, rate, source, suggestedRate, confidence, aiJustification } = req.body;
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
      status: 'pending',
      // Persisted only when the item came from an AI suggestion
      ...(suggestedRate !== undefined && { suggestedRate: Number(suggestedRate) }),
      ...(confidence && { confidence }),
      ...(aiJustification && { aiJustification })
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

/**
 * @desc    Get an AI-suggested market rate for a BOQ item (does not save)
 * @route   POST /api/v1/boq/suggest-pricing
 */
export const suggestPricing = async (req: any, res: Response) => {
  try {
    const { projectId } = req.body;
    // Guard free-text inputs before they reach the LLM
    const description = sanitizePrompt(req.body.description, 300);
    const category = sanitizePrompt(req.body.category, 80);
    const unit = sanitizePrompt(req.body.unit, 40);

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Item description is required." });
    }

    // Resolve regional context from the target project (if one is supplied)
    let location: string | undefined;
    let country: string | undefined;
    if (projectId) {
      const project = await Project.findOne({ _id: projectId, company: req.user.companyId })
        .select('location country region city');
      if (project) {
        country = project.country;
        location =
          [project.city, project.region, project.country].filter(Boolean).join(', ') ||
          project.location ||
          undefined;
      }
    }

    // Pull real anchor prices from the internal marketplace and feed them to the AI
    const marketplaceMatches = await findMarketplaceMatches(description);

    const suggestion = await suggestBOQRate(
      description,
      category || unit || "general",
      location,
      marketplaceMatches
    );

    res.status(200).json({
      ...suggestion,
      location: location || null,
      vatRate: getVatRate(country),
      marketplaceMatches, // powers the AI-vs-marketplace comparison in the UI
      pricedFrom: marketplaceMatches.length ? 'marketplace+ai' : 'ai'
    });
  } catch (error: any) {
    console.error("❌ AI PRICING ERROR:", error.message);
    const quota = /429|quota|Too Many Requests/i.test(error.message || '');
    res.status(quota ? 429 : 503).json({
      message: quota
        ? "AI quota reached for now — please try again in a minute."
        : "AI pricing is currently unavailable.",
      error: error.message
    });
  }
};

/**
 * @desc    AI review of a whole BOQ — missing items, duplicates, alternatives, outliers
 * @route   POST /api/v1/boq/project/:projectId/analyze
 */
export const analyzeProjectBOQ = async (req: any, res: Response) => {
  try {
    const { projectId } = req.params;
    const companyId = req.user.companyId;

    const project = await Project.findOne({ _id: projectId, company: companyId })
      .select('location country region city');
    if (!project) return res.status(404).json({ message: "Project not found" });

    const boq = await BOQ.findOne({ project: projectId, company: companyId });
    if (!boq || boq.items.length === 0) {
      return res.status(200).json({ suggestions: [] });
    }

    const location =
      [project.city, project.region, project.country].filter(Boolean).join(', ') ||
      project.location ||
      undefined;

    // Only review confirmed (non-rejected) items; sanitise descriptions
    const items = boq.items
      .filter((it: any) => it.status !== 'rejected')
      .map((it: any) => ({
        description: sanitizePrompt(it.description, 200),
        unit: it.unit,
        qty: it.qty,
        rate: it.rate,
      }));

    // Provide the marketplace catalogue as reference for alternatives + outliers
    const catalogue = await Product.find({}).limit(40).lean();
    const referencePrices = catalogue.map((p: any) => ({
      name: p.name,
      price: p.price,
      unit: p.unit,
      supplier: p.supplier,
    }));

    const suggestions = await analyzeBOQ(items, location, referencePrices);
    res.status(200).json({ suggestions, location: location || null });
  } catch (error: any) {
    console.error("❌ AI BOQ ANALYSIS ERROR:", error.message);
    const quota = /429|quota|Too Many Requests/i.test(error.message || '');
    res.status(quota ? 429 : 503).json({
      message: quota
        ? "AI quota reached for now — please try again in a minute."
        : "AI analysis is currently unavailable.",
      error: error.message
    });
  }
};