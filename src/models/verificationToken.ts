import { Schema, models, model } from "mongoose";

const verificationTokenSchema = new Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, default: Date.now }, // Kunci untuk rate limit
});

const VerificationToken = models.VerificationToken || model("VerificationToken", verificationTokenSchema);

export default VerificationToken;