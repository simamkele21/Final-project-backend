const Product = require("../Models/ProductModel");

async function getProduct(req, res, next) {
  let Product;
  try {
    Product = await Product.findById(req.params.id);
    if (!Product) {
      return res.status(404).send({ message: "Product not found." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  res.Product = Product;
  next();
}

module.exports = {
  getProduct: getProduct,
};
