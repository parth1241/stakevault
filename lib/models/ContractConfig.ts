import mongoose from 'mongoose';

const ContractConfigSchema = new mongoose.Schema({
  contractId: { type: String, required: true },
  adminWallet: { type: String, required: true },
  networkPassphrase: { type: String, default: 'Test SDF Network ; September 2015' },
  totalStaked: { type: Number, default: 0 },
  totalStakers: { type: Number, default: 0 },
  apyRates: {
    days7: { type: Number, default: 0.03 },
    days30: { type: Number, default: 0.07 },
    days90: { type: Number, default: 0.12 },
  },
  minStake: { type: Number, default: 10 },
  maxStake: { type: Number, default: 10000 },
  isActive: { type: Boolean, default: true },
  deployedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.ContractConfig || mongoose.model('ContractConfig', ContractConfigSchema);
