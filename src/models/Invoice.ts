import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, unique: true }, // e.g., INV-2023-0001
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project' },
  client: {
    name: String,
    email: String,
    address: String
  },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    total: Number
  }],
  subtotal: Number,
  taxRate: { type: Number, default: 15 }, // Default VAT
  totalAmount: Number,
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  dueDate: Date
}, { timestamps: true });

export default mongoose.model('Invoice', InvoiceSchema);