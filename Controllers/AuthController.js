const config = require("../config/auth.config");
const db = require("../Models");
const Client = db.client;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.signup = (req, res) => {
  const client = new Client({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  client.save((err, client) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          client.roles = roles.map((role) => role._id);
          client.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "client" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        client.roles = [role._id];
        client.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
exports.signin = (req, res) => {
  Client.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, client) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!client) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        client.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      var token = jwt.sign({ id: client.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < client.roles.length; i++) {
        authorities.push("ROLE_" + client.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: client._id,
        username: client.username,
        email: client.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
