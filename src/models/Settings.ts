import mongoose, { Schema } from 'mongoose';

const SettingsSchema = new Schema({
  marketplaceCommission: { type: Number, default: 2.5 },
  tenderFee: { type: Number, default: 50 },
  aiSystemPrompt: { type: String, default: "You are BuildHub AI..." },
  maintenanceMode: { type: Boolean, default: false }
}, { timestamps: true });

// Check if model is already compiled to prevent errors during 'dev' reload
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export default Settings;