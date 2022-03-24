const express = require("express");
const Client = require("../Models/UserModel");
// const getProduct = require("../Middleware/GetProduct");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const Product = require("../Models/ProductModel");

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: "Cannot find Client" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.client = client;
  next();
}

router.get("/", getClient, (req, res) => {
  return res.send(res.client.cart);
});

router.post("/:id", getClient, async (req, res) => {
  let Product = await Product.findById(req.params.id).lean();
  let qty = req.body.qty;
  let cart = res.client.cart;
  let added = false;
  cart.forEach((item) => {
    if (item._id.valueOf() == product._id.valueOf()) {
      item.qty += qty;
      added = true;
    }
  });

  if (!added) {
    cart.push({ ...product, qty });
  }
  try {
    res.client.cart = cart;

    let token = jwt.sign(
      { _id: req.clientId, cart: res.client.cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    const updatedClient = await res.client.save();
    res.status(200).json({ updatedClient, token });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id",getClient, async (req, res) => {
  const client = await Client.findById(req.client._id);
  const inCart = client.cart.some((prod) => prod._id == req.params._id);

  let updatedClient;
  if (inCart) {
    const product = client.cart.find((prod) => prod._id == req.params._id);
    product.qty += req.body.qty;
    updatedClient = await client.save();
  } else {
    client.cart.push({ ...res.product, qty: req.body.qty });
    updatedClient = await client.save;
  }
  try {
    const ACCESS_TOKEN_SECRET = jwt.sign(
      JSON.stringify(updatedClient),
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({ jwt: ACCESS_TOKEN_SECRET, cart: updatedClient.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", getClient, async (req, res) => {
  let cart = res.client.cart;
  cart.forEach((cartitem) => {
    if (cartitem._id == req.params.id) {
      cart = cart.filter((cartitems) => cartitems._id != req.params.id);
    }
  });
  try {
    res.client.cart = cart;

    const updated = res.client.save();
    let token = jwt.sign(
      { _id: req.clientId, cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    res.json({ message: "Deleted product", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
