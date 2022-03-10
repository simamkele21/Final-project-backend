const express = require("express");
const router = require("express").Router();
const Product = require("../Models/ProductModel");
// const { getProduct } = require("../Middleware/GetProduct");
// const fixArrayID = require("../Helpers");

//Getting all Products.
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Getting one Product.
router.get("/:id", getProduct, (req, res) => {
  res.send(res.product);
});

//Creating one Product.
router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    catergory: req.body.catergory,
    image: req.body.image,
    price: req.body.price,
  });
  try {
    const newProduct = await product.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Updating one Product.
router.put("/:id", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.Product.name = req.body.name;
  }
  if (req.body.catergory != null) {
    res.Product.catergory = req.body.catergory;
  }
  if (req.body.description != null) {
    res.Product.description = req.body.description;
  }
  if (req.body.image != null) {
    res.Product.image = req.body.image;
  }
  if (req.body.price != null) {
    res.Product.price = req.body.price;
  }
  try {
    const updateProduct = await res.product.save();
    res.send(updateProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Delete one Product.
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.Product.remove();
    res.send({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).send({ message: "Product not found." });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}
module.exports = router;
