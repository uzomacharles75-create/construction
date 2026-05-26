import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., 'Bag', 'Sheet', 'Ton'
  supplier: { type: String, required: true },
  image: String,
  description: String,
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);