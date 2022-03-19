const mongoose = require("mongoose");
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique email for each user
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    // required: true,
  },
  token: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    default: 0,
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Client", clientSchema);
