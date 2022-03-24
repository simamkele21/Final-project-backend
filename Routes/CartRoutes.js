const express = require("express");
const verifyToken = require("../Middleware/Auth");
const Client = require("../Models/UserModel");
const getProduct = require("../Middleware/GetProduct");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../Models/ProductModel");

router.get("/", [verifyToken, getClient], (req, res) => {
  return res.send(res.client.cart);
});

router.post("/:id", [verifyToken, getClient], async (req, res) => {
  let Product = await Product.findById(req.params.id).lean();
  let qty = req.body.qty;
  let cart = res.client.cart;
  let added = false;
  cart.forEach((item) => {
    if (item._id.valueOf() == movie._id.valueOf()) {
      item.qty += qty;
      added = true;
    }
  });

  if (!added) {
    cart.push({ ...movie, qty });
  }
  try {
    res.user.cart = cart;

    let token = jwt.sign(
      { _id: req.userId, cart: res.user.cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    const updatedUser = await res.user.save();
    res.status(200).json({ updatedUser, token });
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", [verifyToken, getMovie], async (req, res) => {
  const user = await User.findById(req.user._id);
  const inCart = user.cart.some((prod) => prod._id == req.params._id);

  let updatedUser;
  if (inCart) {
    const movie = user.cart.find((prod) => prod._id == req.params._id);
    movie.qty += req.body.qty;
    updatedUser = await user.save();
  } else {
    user.cart.push({ ...res.movie, qty: req.body.qty });
    updatedUser = await user.save;
  }
  try {
    const ACCESS_TOKEN_SECRET = jwt.sign(
      JSON.stringify(updatedUser),
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({ jwt: ACCESS_TOKEN_SECRET, cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", [verifyToken, getUser], async (req, res) => {
  let cart = res.user.cart;
  cart.forEach((cartitem) => {
    if (cartitem._id == req.params.id) {
      cart = cart.filter((cartitems) => cartitems._id != req.params.id);
    }
  });
  try {
    res.user.cart = cart;

    const updated = res.user.save();
    let token = jwt.sign(
      { _id: req.userId, cart },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400, // 24 hours
      }
    );
    res.json({ message: "Deleted movie", updated, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.userId);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find User" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
