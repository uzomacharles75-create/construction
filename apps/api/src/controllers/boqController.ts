import { Response } from 'express';
import BOQ from '../models/BOQ';
import Project from '../models/Project'; // CRITICAL: Added missing import
import { suggestBOQRate, analyzeBOQ, generateBOQ } from '../services/aiService';
import { getVatRate } from '../utils/taxRates';
import { sanitizePrompt } from '../utils/promptGuard';
import Product from '../models/Product';
import PriceFeedback from '../models/PriceFeedback';

/**
 * Record how a user responded to an AI price suggestion (learning loop, req #7).
 * Fire-and-forget — never blocks the main request.
 */
const recordPriceFeedback = async (data: {
  company: any; project?: any; description: string; category?: string;
  location?: string; aiSuggestedRate: number; finalRate: number;
  confidence?: string; action: 'accepted' | 'edited' | 'rejected';
}) => {
  try {
    const delta = data.finalRate - data.aiSuggestedRate;
    await PriceFeedback.create({
      ...data,
      delta,
      deltaPct: data.aiSuggestedRate ? delta / data.aiSuggestedRate : 0,
    });
  } catch (err: any) {
    console.error('⚠️  Failed to record price feedback:', err.message);
  }
};

/**
 * Pull the most relevant past corrections for an item, to nudge future estimates.
 */
const getRelevantFeedback = async (company: any, description: string, location?: string) => {
  const words = description.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
  const query: any = { company, action: { $in: ['accepted', 'edited'] } };
  if (words.length) query.description = new RegExp(words.join('|'), 'i');

  let matches = await PriceFeedback.find(query).sort({ createdAt: -1 }).limit(5).lean();
  // Prefer same-location corrections when available
  if (location) {
    matches.sort((a: any, b: any) => (b.location === location ? 1 : 0) - (a.location === location ? 1 : 0));
  }
  return matches.map((m: any) => ({
    description: m.description,
    aiSuggestedRate: m.aiSuggestedRate,
    finalRate: m.finalRate,
    location: m.location,
  }));
};

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

    // Learning loop: an AI item that carries a suggestedRate is an accept (or edit)
    if (source === 'ai' && suggestedRate !== undefined) {
      const finalRate = Number(rate);
      const suggested = Number(suggestedRate);
      const location = [project.city, project.region, project.country].filter(Boolean).join(', ') || project.location;
      recordPriceFeedback({
        company: companyId, project: projectId, description,
        location, aiSuggestedRate: suggested, finalRate, confidence,
        action: finalRate === suggested ? 'accepted' : 'edited',
      });
    }

    res.status(201).json({ message: "Item added", data: boq });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Record a rejected AI price suggestion (learning loop)
 * @route   POST /api/v1/boq/feedback/reject
 */
export const rejectSuggestion = async (req: any, res: Response) => {
  try {
    const description = sanitizePrompt(req.body.description, 300);
    const { aiSuggestedRate, location, confidence, projectId } = req.body;
    if (!description || aiSuggestedRate === undefined) {
      return res.status(400).json({ message: "description and aiSuggestedRate are required." });
    }
    await recordPriceFeedback({
      company: req.user.companyId, project: projectId || undefined, description,
      location, aiSuggestedRate: Number(aiSuggestedRate), finalRate: 0, confidence,
      action: 'rejected',
    });
    res.status(201).json({ message: "Feedback recorded" });
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

    // Learning loop: nudge the estimate with the user's past corrections for similar items
    const pastCorrections = await getRelevantFeedback(req.user.companyId, description, location);

    const suggestion = await suggestBOQRate(
      description,
      category || unit || "general",
      location,
      marketplaceMatches,
      pastCorrections
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

/**
 * @desc    Generate a full draft BOQ from a free-text construction brief
 * @route   POST /api/v1/boq/generate
 */
export const generateBOQDraft = async (req: any, res: Response) => {
  try {
    const brief = sanitizePrompt(req.body.brief, 1000);
    const { projectId } = req.body;

    if (!brief || !brief.trim()) {
      return res.status(400).json({ message: "A construction brief is required." });
    }

    // Resolve regional context from the target project (if one is supplied)
    let location: string | undefined;
    if (projectId) {
      const project = await Project.findOne({ _id: projectId, company: req.user.companyId })
        .select('location country region city');
      if (project) {
        location =
          [project.city, project.region, project.country].filter(Boolean).join(', ') ||
          project.location ||
          undefined;
      }
    }

    // Provide a broad marketplace catalogue as price anchors for the whole BOQ
    const catalogue = await Product.find({}).limit(40).lean();
    const referencePrices = catalogue.map((p: any) => ({
      name: p.name,
      price: p.price,
      unit: p.unit,
      supplier: p.supplier,
    }));

    const result = await generateBOQ(brief, location, referencePrices);
    res.status(200).json({ ...result, location: location || null });
  } catch (error: any) {
    console.error("❌ AI BOQ GENERATION ERROR:", error.message);
    const quota = /429|quota|Too Many Requests/i.test(error.message || '');
    res.status(quota ? 429 : 503).json({
      message: quota
        ? "AI quota reached for now — please try again in a minute."
        : "BOQ generation is currently unavailable.",
      error: error.message
    });
  }
};