import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketplaceActivity extends Document {
  action: 'product_view' | 'search' | 'whatsapp_click' | 'chat_click' | 'rfq_request';
  region: string;
  city: string;
  metadata: {
    productId?: mongoose.Types.ObjectId;
    productName?: string;
    category?: string;
    searchTerm?: string;
    supplierId?: mongoose.Types.ObjectId;
  };
  createdAt: Date;
}

const MarketplaceActivitySchema = new Schema({
  action: { 
    type: String, 
    enum: ['product_view', 'search', 'whatsapp_click', 'chat_click', 'rfq_request'],
    required: true 
  },
  region: { type: String, required: true },
  city: { type: String, required: true },
  metadata: {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    category: String,
    searchTerm: String,
    supplierId: { type: Schema.Types.ObjectId, ref: 'Company' },
  }
}, { timestamps: true });

export default mongoose.model<IMarketplaceActivity>('MarketplaceActivity', MarketplaceActivitySchema);
