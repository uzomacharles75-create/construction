import { Request, Response } from 'express';
import Company from '../models/Company';
import Service from '../models/Service';

/**
 * @desc    Get all verified companies for the public directory
 * @route   GET /api/v1/explore/companies
 */

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { service, city } = req.query;

    // 1. Base Filter: Only show approved companies
    let filter: any = { status: 'verified' }; 

    // 2. SEARCH LOGIC: company name, sector, or linked public services
    if (service) {
      const serviceRegex = { $regex: service as string, $options: 'i' };
      const companiesWithService = await Service.distinct('company', {
        isPublic: true,
        $or: [{ name: serviceRegex }, { category: serviceRegex }, { description: serviceRegex }],
      });
      filter.$or = [
        { name: serviceRegex },
        { sector: serviceRegex },
        { _id: { $in: companiesWithService } },
      ];
    }

    // 3. LOCATION LOGIC: Search by City
    if (city) {
      filter.city = { $regex: city as string, $options: 'i' };
    }

    // 4. DATABASE QUERY
    const companies = await Company.find(filter)
      .select('name slug city country logo services rating status createdAt portfolio') // Kept logo and added portfolio
      .sort({ createdAt: -1 });

    res.status(200).json(companies);

  } catch (error) {
    console.error("Explore Controller Error:", error);
    res.status(500).json({ message: "Failed to load directory data." });
  }
};

/**
 * @desc    Get a specific company's public profile by its slug
 * @route   GET /api/v1/explore/company/:slug
 */
export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Find company by slug and hide sensitive internal fields
    const company = await Company.findOne({ slug, status: 'verified' })
      .select('-owner -updatedAt -__v');

    if (!company) {
      return res.status(404).json({ message: "Professional profile not found." });
    }

    const offeredServices = await Service.find({ company: company._id, isPublic: true })
      .sort({ createdAt: -1 })
      .select('name category description image priceFrom priceTo unit createdAt');

    res.status(200).json({ ...company.toObject(), offeredServices });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile details." });
  }
};

/**
 * @desc    Get company public profile by SLUG (any status — used for preview links)
 * @route   GET /api/v1/explore/company/:slug/preview
 */
export const getCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const company = await Company.findOne({ slug })
      .select('-owner -updatedAt -__v');

    if (!company) {
      return res.status(404).json({ message: "Professional profile not found." });
    }

    const offeredServices = await Service.find({ company: company._id, isPublic: true })
      .sort({ createdAt: -1 })
      .select('name category description image priceFrom priceTo unit createdAt');

    res.status(200).json({ ...company.toObject(), offeredServices });
  } catch {
    res.status(500).json({ message: "Infrastructure error retrieving profile." });
  }
};