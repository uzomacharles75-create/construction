import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  company: mongoose.Types.ObjectId;
  itemName: string;
  supplier: string;
  orderNumber: string;
  amount: number;
  status: 'Processing' | 'In Transit' | 'Delivered';
  createdAt: Date;
}

const OrderSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  itemName: { type: String, required: true },
  supplier: { type: String, required: true },
  orderNumber: { type: String, unique: true },
  amount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Processing', 'In Transit', 'Delivered'], 
    default: 'Processing' 
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);