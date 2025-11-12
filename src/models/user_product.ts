import { Schema, model, models } from "mongoose";

const UserProductSchema = new Schema<IUserProduct>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', // Menghubungkan ke model 'User'
      required: true 
    },
    product: { 
      type: Schema.Types.ObjectId, 
      ref: 'Product', // Menghubungkan ke model 'Product'
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "aktif"], // Status hanya bisa 'pending' atau 'aktif'
      default: "pending",
      required: true
    },
    lastWatchedVideoId: { 
      type: String, 
      default: null // Defaultnya null sampai user mulai menonton
    }
  },
  { timestamps: true }
);

// Tambahkan index untuk mempercepat query pencarian kepemilikan
UserProductSchema.index({ user: 1, product: 1 }, { unique: true });

export default models.UserProduct || model<IUserProduct>("UserProduct", UserProductSchema);