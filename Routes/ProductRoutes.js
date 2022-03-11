const express = require("express");
const router = express.Router();
const Product = require("../Models/ProductModel");

//Getting all Products.
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
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
  const products = Product({
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
  });
  try {
    const newProduct = await products.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Updating one Product.
router.put("/:id", getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.catergory != null) {
    res.product.catergory = req.body.catergory;
  }
  if (req.body.description != null) {
    res.product.description = req.body.description;
  }
  if (req.body.image != null) {
    res.product.image = req.body.image;
  }
  if (req.body.price != null) {
    res.product.price = req.body.price;
  }
  try {
    const updateProduct = await res.product.save();
    res.json(updateProduct);
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
