const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Client", clientSchema);
