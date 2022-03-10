const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

verifyToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).send({ message: "No token provided!" });
  jwt.verify(token, process.env.ACC_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded._id;
    next();
  });
};

module.exports = verifyToken;
