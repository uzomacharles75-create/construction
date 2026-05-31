import { Request, Response } from 'express';
import MarketplaceActivity from '../models/MarketplaceActivity';
import Product from '../models/Product';
import Company from '../models/Company';
import { analyzeSupplierData, analyzeGlobalMarketplaceData } from '../services/aiService';

// @desc    Get AI Intelligence metrics for Supplier
// @route   GET /api/marketplace/intelligence/supplier
// @access  Protected (Supplier)
export const getSupplierIntelligence = async (req: Request, res: Response) => {
  try {
    const supplierId = req.user?.companyId;

    // 1. Gather raw DB stats for this supplier (and some market context)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // Total product views for supplier
    const productViews = await MarketplaceActivity.countDocuments({ 
      action: 'product_view', 
      'metadata.supplierId': supplierId 
    });

    // Market searches
    const topSearches = await MarketplaceActivity.aggregate([
      { $match: { action: 'search', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$metadata.searchTerm', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Regional activity
    const regionalActivity = await MarketplaceActivity.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$region', count: { $sum: 1 }, categories: { $addToSet: '$metadata.category' } } }
    ]);

    // Whatsapp/Chat clicks
    const interactions = await MarketplaceActivity.aggregate([
      { $match: { action: { $in: ['whatsapp_click', 'chat_click', 'rfq_request'] }, 'metadata.supplierId': supplierId } },
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    const supplierProducts = await Product.find({ ownerId: supplierId });

    // Aggregate into a raw object
    const rawData = {
      productViews,
      topSearches,
      regionalActivity,
      interactions,
      totalSupplierProducts: supplierProducts.length
    };

    // 2. Pass raw data to OpenAI to synthesize the JSON object
    const intelligenceData = await analyzeSupplierData(rawData);

    res.status(200).json(intelligenceData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI Intelligence metrics for Administrator
// @route   GET /api/admin/marketplace/intelligence
// @access  Protected (Admin)
export const getAdminIntelligence = async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // 1. Gather global DB stats
    const totalSuppliers = await Company.countDocuments({ isVerified: true });
    const totalProducts = await Product.countDocuments();
    
    const activityCounts = await MarketplaceActivity.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } }
    ]);

    const regionalDemand = await MarketplaceActivity.aggregate([
      { $match: { action: { $in: ['search', 'product_view'] }, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryDemand = await MarketplaceActivity.aggregate([
      { $match: { 'metadata.category': { $exists: true }, createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$metadata.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const rawGlobalData = {
      totalSuppliers,
      totalProducts,
      activityCounts,
      regionalDemand,
      categoryDemand
    };

    // 2. Pass to OpenAI
    const adminIntelligenceData = await analyzeGlobalMarketplaceData(rawGlobalData);

    res.status(200).json(adminIntelligenceData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
