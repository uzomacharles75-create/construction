import { Request, Response } from 'express';
import Company from '../models/Company';

/**
 * @desc    Get all verified companies for the public directory
 * @route   GET /api/v1/explore/companies
 */

export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { service, city } = req.query;

    // 1. Base Filter: Only show approved companies
    let filter: any = { status: 'verified' }; 

    // 2. SEARCH LOGIC: Search in Company Name OR Services Array
    if (service) {
      filter.$or = [
        { name: { $regex: service as string, $options: 'i' } },     // Search by Company Name
        { services: { $regex: service as string, $options: 'i' } } // Search by Services offered
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

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile details." });
  }
};
/**
 * @desc    Get company public profile by SLUG
 * @route   GET /api/v1/explore/company/:slug
 */
export const getCompanyBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Search MongoDB for the unique name string
    const company = await Company.findOne({ slug })
      .select('-owner -updatedAt -__v');

    if (!company) {
      return res.status(404).json({ message: "Professional profile not found." });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Infrastructure error retrieving profile." });
  }
};