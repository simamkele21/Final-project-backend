require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const productRoutes = require("./Routes/ProductRoutes");
const userRoutes = require("./Routes/UserRoutes");
const cartRoutes = require("./Routes/CartRoutes");
const contactRoutes = require("./Routes/ContactRoutes");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to Simamkele's E-commerce backend Database");
});
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Welcome to Simamkele's E-commerce backend" });
});
app.use("/Products", productRoutes);
app.use("/Clients", userRoutes);
app.use("/Cart", cartRoutes);
app.use("/Contact", contactRoutes);

const port = process.env.PORT || 2029;
app.listen(port, () => console.log(`Listening on port ${port} ...`));
