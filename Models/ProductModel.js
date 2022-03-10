const mongoose = require("mongoose");
// const ObjectID = mongoose.Schema.Types.ObjectId;

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", ProductSchema);
