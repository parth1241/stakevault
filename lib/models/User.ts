import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['staker', 'admin'], default: 'staker' },
  linkedWallet: { type: String, default: '' },
  avatarColor: { type: String, default: '#8b5cf6' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  rememberMe: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
  preferences: {
    emailOnYield: { type: Boolean, default: true },
    emailOnUnlock: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true },
  },
  totalStaked: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
