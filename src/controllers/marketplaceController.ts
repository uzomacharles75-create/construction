import { Request, Response } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';

// 1. PUBLIC: Get materials for the shop
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = category ? { category: category as string } : {};
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching marketplace" });
  }
};

// 2. OWNER: Place an order for a site
export const createOrder = async (req: any, res: Response) => {
  try {
    const { itemName, supplier, amount } = req.body;
    const newOrder = new Order({
      company: req.user.companyId,
      itemName,
      supplier,
      amount,
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Failed to process order" });
  }
};

// 3. OWNER: Get active site deliveries (Fixes the 404)
export const getOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ company: req.user.companyId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// 4. OWNER: Get spending analytics for widget (Fixes the 404)
export const getMarketplaceStats = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ company: req.user.companyId });
    const totalSpent = orders.reduce((acc, curr) => acc + curr.amount, 0);
    
    res.status(200).json({
      totalSpent,
      budgetUtilization: totalSpent > 0 ? Math.min(Math.round((totalSpent / 50000) * 100), 100) : 0,
      availableCredit: Math.max(50000 - totalSpent, 0)
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating stats" });
  }
};

// 5. ADMIN ONLY: Add new material to global database
export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product added to BuildHub Catalog", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};