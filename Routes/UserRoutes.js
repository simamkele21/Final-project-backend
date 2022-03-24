const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyAcc = require("../Middleware/Auth");
const DuplicatedNameorEmail = require("../middleware/verifyInfo");
const Client = require("../Models/UserModel");

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: "Cannot find Client" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}


async function findByCredentials(req, res, next) {
  let client;
  try {
    email = await Client.findOne({ email: req.body.email });
    password = await Client.findOne({ password: req.body.password });
    if (client || email) {
      return res.status(404).send({ message: "successfully loged-in" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Invalid user" });
  }
  next();
}

// //Getting all clients.
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// //Getting one account.
router.get("/:id", Client, (req, res) => {
  res.send(res.client);
});

// //signup
router.post("/signup", DuplicatedNameorEmail, async (req, res, next) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    phoneNnumber: req.body.phoneNumber,
  });
  try {
    const newClient = await client.save();
    // res.status(201).json(newClient);
    res.status(200).send({ message: "Created new client" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// //login

router.post("/login",findByCredentials, async (req, res) => {
  try {
    Client.findOne({ name: req.body.name }, (err, client) => {
      if (err) return handleError(err);
      if (!client) {
        return res.status(404).send({ message: "client Not found." });
      }
      let passwordIsValid = bcrypt.compare(req.body.password, client.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      console.log(process.env.ACCESS_TOKEN_SECRET);
      let token = jwt.sign({ id: client.id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "72h",
      });
      res.status(200).send({
        id: client.id,
        name: client.name,
        email: client.email,
        password: client.password,
        cart: client.cart,
        accessToken: token,
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// //Update
router.put("/:id", getClient, async (req, res) => {
  if (req.body.id != req.clientId) {
    return res.status(401).send({ message: "Unauthorized!" });
  }
  if (req.body.name != null) {
    res.client.name = req.body.name;
  }
  if (req.body.email != null) {
    res.client.email = req.body.email;
  }
  if (req.body.password != null) {
    res.client.password = req.body.password;
  }
  if (req.body.join_date != null) {
    res.client.join_date = req.body.join_date;
  }
  try {
    const updatedClient = await res.client.save();
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//deleting a client
router.delete("/:id", [getClient, verifyAcc], async (req, res) => {
  try {
    await res.client.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// //logout
router.post("/logout", async (req, res) => {
  try {
    req.client.tokens = req.client.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.client.save();
    res.send({ message: "Client logged out" });
  } catch (err) {
    res.status(500).send({ message: "failed logging client out" });
  }
});

module.exports = router;
