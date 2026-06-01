import { Response } from 'express';
import Project from '../models/Project';

export const createProject = async (req: any, res: Response) => {
  try {
    const { name, location, country, region, city, clientName, budget } = req.body;

    // Compose a human-readable location string from structured parts when not given explicitly
    const composedLocation =
      location ||
      [city, region, country].filter(Boolean).join(', ') ||
      undefined;

    const newProject = new Project({
      name,
      location: composedLocation,
      country,
      region,
      city,
      clientName,
      budget,
      company: req.user.companyId // Extracted from JWT
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const getCompanyProjects = async (req: any, res: Response) => {
  try {
    // ONLY fetch projects belonging to this user's company
    const projects = await Project.find({ company: req.user.companyId }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};