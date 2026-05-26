import { Response } from 'express';
import Document from '../models/Document';
import Project from '../models/Project';

/**
 * @desc    Get all documents for the logged-in company
 * @route   GET /api/v1/documents
 * @access  Protected
 */
export const getDocuments = async (req: any, res: Response) => {
  try {
    // Only fetch documents belonging to this company (Tenant Isolation)
    const documents = await Document.find({ company: req.user.companyId })
      .populate('project', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving documents" });
  }
};

/**
 * @desc    Upload a document and save metadata
 * @route   POST /api/v1/documents/upload
 * @access  Protected
 */
export const uploadDocument = async (req: any, res: Response) => {
  try {
    // req.file is populated by Multer-Cloudinary middleware
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { projectId, name, category } = req.body;

    // Optional: Verify project exists and belongs to this company
    if (projectId) {
      const projectExists = await Project.findOne({ _id: projectId, company: req.user.companyId });
      if (!projectExists) return res.status(404).json({ message: "Project not found" });
    }

    const newDoc = new Document({
      name: name || req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL
      fileType: req.file.mimetype.split('/')[1].toUpperCase(),
      fileSize: (req.file.size / 1024 / 1024).toFixed(2) + " MB",
      category: category || 'General',
      company: req.user.companyId,
      project: projectId || null,
      uploadedBy: req.user.id
    });

    await newDoc.save();

    res.status(201).json({
      message: "Document secured in BuildHub Cloud",
      document: newDoc
    });
  } catch (error) {
    res.status(500).json({ message: "Cloud upload failed" });
  }
};

/**
 * @desc    Delete a document
 * @route   DELETE /api/v1/documents/:id
 */
export const deleteDocument = async (req: any, res: Response) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, company: req.user.companyId });

    if (!document) {
      return res.status(404).json({ message: "Document not found or access denied" });
    }

    // Logic to delete from Cloudinary could be added here using document.fileUrl
    await document.deleteOne();

    res.status(200).json({ message: "Document removed from system" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
};