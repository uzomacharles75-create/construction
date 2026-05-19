import { Request, Response } from 'express';
import User from '../models/User';
import Company from '../models/Company';
import { ensureCompanyHasSlug } from '../utils/companySlug';
import Project from '../models/Project';
import Invoice from '../models/Invoice';
import Tender from '../models/Tender';
import Message from '../models/Message';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register + Auto-generate Slug
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, companyName, city, country, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword, role: role || 'owner' });
    await user.save();

    const company = new Company({ 
      name: companyName, city, country, owner: user._id, status: 'pending' 
    });
    await company.save(); // Model middleware handles slug generation

    user.company = company._id as any;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: company._id, slug: company.slug },
      process.env.JWT_SECRET!, { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: "BuildHub Office Initialized",
      token, 
      user: { id: user._id, name: user.name, role: user.role, companyId: company._id, slug: company.slug } 
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed at infrastructure level." });
  }
};

// @desc    Login + Return Slug
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('company');
    if (!user) return res.status(404).json({ message: "Identity not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const companyDoc = user.company as any;
    if (companyDoc && !companyDoc.slug) {
      await ensureCompanyHasSlug(companyDoc);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, companyId: companyDoc?._id, slug: companyDoc?.slug },
      process.env.JWT_SECRET!, { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token, 
      user: { 
         id: user._id, 
    name: user.name, 
    role: user.role, 
    companyId: companyDoc?._id, 
    company: companyDoc?.name,
    slug: companyDoc?.slug
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Login authentication failed." });
  }
};

const getAuthorizedCompany = async (req: any, slug?: string) => {
  let company = slug && slug !== 'undefined'
    ? await Company.findOne({ slug })
    : null;

  if (!company && req.user?.companyId) {
    company = await Company.findById(req.user.companyId);
    if (company && !company.slug) {
      await ensureCompanyHasSlug(company);
    }
  }

  if (!company) return null;
  if (company._id.toString() !== req.user.companyId.toString()) return null;
  return company;
};

// @desc    Get logged-in user's company profile (slug-safe)
export const getMyCompanyProfile = async (req: any, res: Response) => {
  try {
    const company = await getAuthorizedCompany(req);
    if (!company) return res.status(404).json({ message: "Business profile not found." });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving business data." });
  }
};

// @desc    Get Company by Slug (Fixes 404)
export const getCompanyBySlug = async (req: any, res: Response) => {
  try {
    const company = await getAuthorizedCompany(req, req.params.slug);
    if (!company) return res.status(404).json({ message: "Business profile not found." });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving business data." });
  }
};

// @desc    Update Company by Slug
export const updateCompanyBySlug = async (req: any, res: Response) => {
  try {
    const { slug } = req.params;
    
    const company = await Company.findOne({ slug });
    if (!company || company._id.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: "Unauthorized update attempt." });
    }

    const updated = await Company.findOneAndUpdate({ slug }, req.body, { new: true });
    res.status(200).json({ message: "Business profile secured and updated", company: updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed." });
  }
};

// @desc    Dashboard Summary
export const getSummary = async (req: any, res: Response) => {
  try {
    const companyId = req.user.companyId;
    const [projectCount, invoiceCount, tenderCount, msgCount, invoices] = await Promise.all([
      Project.countDocuments({ company: companyId }),
      Invoice.countDocuments({ company: companyId, status: 'Pending' }),
      Tender.countDocuments({ status: 'Open' }),
      Message.countDocuments({ isRead: false }),
      Invoice.find({ company: companyId })
    ]);

    const totalIncome = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const totalExpenses = 45000; // Placeholder

    res.status(200).json({
      projectCount, invoiceCount, tenderCount, msgCount,
      totalIncome, totalExpenses, balance: totalIncome - totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to aggregate dashboard data." });
  }
};
export const updateCompanyLogo = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided" });

    const company = await getAuthorizedCompany(req, req.params.slug);
    if (!company) return res.status(403).json({ message: "Unauthorized update attempt." });

    company.logo = req.file.path;
    await company.save();

    res.status(200).json({ message: "Logo updated in cloud", logo: company.logo });
  } catch (error) {
    console.error('Logo upload error:', error);
    res.status(500).json({ message: "Cloudinary upload failed" });
  }
};

export const updateCompanyPortfolio = async (req: any, res: Response) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No photos provided" });

    const company = await getAuthorizedCompany(req, req.params.slug);
    if (!company) return res.status(403).json({ message: "Unauthorized update attempt." });

    const imageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    company.portfolio = [...(company.portfolio || []), ...imageUrls];
    await company.save();

    res.status(200).json({ message: "Portfolio Sync Successful", portfolio: company.portfolio });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({ message: "Portfolio upload failed" });
  }
};

export const deleteCompanyPortfolioImage = async (req: any, res: Response) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: "Image URL is required" });

    const company = await getAuthorizedCompany(req, req.params.slug);
    if (!company) return res.status(403).json({ message: "Unauthorized update attempt." });

    company.portfolio = (company.portfolio || []).filter((url) => url !== imageUrl);
    await company.save();

    res.status(200).json({ message: "Image removed from portfolio", portfolio: company.portfolio });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove image" });
  }
};