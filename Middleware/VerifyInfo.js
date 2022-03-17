const Client = require("../Models/UserModel");
const credentialsCheck = (req, res, next) => {
  Client.findOne({
    email: req.body.email,
    password: req.body.password,
  }).exec((err, client) => {
    if (err) return res.status(500).send({ message: err });
    if (client)
      return res.status(400).send({ message: "Email already in use!" });
    next();
  });
};

const verifyInfo = credentialsCheck;
module.exports = verifyInfo;
