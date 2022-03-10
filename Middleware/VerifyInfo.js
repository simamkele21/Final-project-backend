const user = require("../Models/UserModel");
const credentialsCheck = (req, res, next) => {
  user
    .findOne({
      email: req.body.email,
    })
    .exec((err, user) => {
      if (err) return res.status(500).send({ message: err });
      if (user)
        return res.status(400).send({ message: "Email already in use!" });
      next();
    });
};

const verifyInfo = credentialsCheck;
module.exports = verifyInfo;
