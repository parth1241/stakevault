import mongoose from 'mongoose';

const StakePositionSchema = new mongoose.Schema({
  stakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stakerWallet: { type: String, required: true },
  contractId: { type: String, required: true },
  amountXLM: { type: Number, required: true },
  lockPeriodDays: { type: Number, required: true, enum: [7, 30, 90] },
  apyRate: { type: Number, required: true },
  stakedAt: { type: Date, required: true, default: Date.now },
  unlocksAt: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'unlocked', 'withdrawn', 'emergency_withdrawn'], 
    default: 'active' 
  },
  txHashStake: { type: String },
  txHashUnstake: { type: String },
  yieldEarned: { type: Number, default: 0 },
  lastYieldClaim: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.StakePosition || mongoose.model('StakePosition', StakePositionSchema);
