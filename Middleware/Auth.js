const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const Client = require("../Models/UserModel");
const db = require("../Models");
// const Customer = db.customer;

// const auth = async (req, res, next) => {
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const client = await Client.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });
//     if (!client) {
//       throw new Error();
//     }
//     req.token = token;
//     req.client = client;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: "Authentication required" });
//   }
// };
// const authJwt = {
//   verifyToken,
//   isAdmin,
// };
const Role = db.role;
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.clientId = decoded.id;
    next();
  });
};
isAdmin = (req, res, next) => {
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
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};
isModerator = (req, res, next) => {
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
          if (roles[i].name === "moderator") {
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
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
};
module.exports = authJwt;
