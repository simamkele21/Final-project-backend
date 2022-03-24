const jwt = require("jsonwebtoken");
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
verifyToken = (req, res, next) => {
  let authHeader = req.headers["x-access-token"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) 
    return res.status(403).send({ message: "No token provided!" });
  
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.clientId = decoded.id;
    // req.cart = decoded.cart;
    next();
  });
};
// isAdmin = (req, res, next) => {
//   Client.findById(req.clientId).exec((err, client) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }
//     Role.find(
//       {
//         _id: { $in: client.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }
//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "admin") {
//             next();
//             return;
//           }
//         }
//         res.status(403).send({ message: "Require Admin Role!" });
//         return;
//       }
//     );
//   });
// };
// isClient = (req, res, next) => {
//   Client.findById(req.clientId).exec((err, client) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }
//     Role.find(
//       {
//         _id: { $in: client.roles },
//       },
//       (err, roles) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }
//         for (let i = 0; i < roles.length; i++) {
//           if (roles[i].name === "client") {
//             next();
//             return;
//           }
//         }
//         res.status(403).send({ message: "Require Moderator Role!" });
//         return;
//       }
//     );
//   });
// };
// const authJwt = {
//   verifyToken,
//   isAdmin,
//   isClient,
// };
module.exports = verifyToken;
