import mongoose, { Schema, Model } from "mongoose";

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Pastikan nama model User kamu 'User'
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Pastikan nama model Product kamu 'Product'
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Membatasi bintang 1-5
    },
    comment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Index untuk performa query (tidak unique, karena user bisa review 3 kali)
reviewSchema.index({ userId: 1, productId: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;