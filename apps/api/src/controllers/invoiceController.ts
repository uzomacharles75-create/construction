import { Request, Response } from 'express';

// Ensure the word 'export' is at the start of every function
export const createInvoice = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ message: "Invoice created" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const getInvoices = async (req: Request, res: Response) => {
  try {
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};