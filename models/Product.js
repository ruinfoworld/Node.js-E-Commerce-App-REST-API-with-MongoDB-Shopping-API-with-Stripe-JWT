import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, require: true, unique: true },
    desc: { type: String, require: true },
    img: { type: String, require: true },
    categories: { type: Array, require: true },
    size: { type: String },
    color: { type: String },
    Price: { type: String, require: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
