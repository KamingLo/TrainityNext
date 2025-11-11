import mongoose, { Schema } from "mongoose";

const VideoSchema = new Schema<IVideo>({
  namaPelajaran: { type: String, required: true },
  kodePelajaran: { type: String, required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    shortDesc: { type: String, required: true },
    desc: { type: String, required: true },
    video: { type: [VideoSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
