const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const Client = require("../Models/UserModel");
const db = require("../Models");

const Role = db.role;
verifyToken = (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.client = decoded;
    next()
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
  // jwt.verify(token, config.secret, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).send({ message: "Unauthorized!" });
  //   }
  //   req.clientId = decoded.id;
  //   next();
  // });
};
isAdmin = (req, res, next) => {
  Client.findById(req.clientId).exec((err, client) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.clientId = decoded.id;
    // req.cart = decoded.cart;
    next();
  });
};
isClient = (req, res, next) => {
  Client.findById(req.clientId).exec((err, client) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: client.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "client") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};
const auth = {
  verifyToken,
  isAdmin,
  isClient,
};
module.exports = auth;
