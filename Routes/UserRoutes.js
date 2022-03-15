const express = require("express");
const router = express.Router();
const Client = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Middleware/Auth");

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
router.post("/signup", DuplicatednameorEmail, async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const client = new Client({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone_number: req.body.phone_number,
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// //login
router.post("/login", async (req, res) => {
  try {
    const client = await Client.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await client.generateAuthToken();
    res.send({ client, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// //logout
router.post("/logout", async (req, res) => {
  try {
    req.client.tokens = req.client.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.client.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

// //logout All
router.post("/logoutAll", async (req, res) => {
  try {
    req.client.tokens = [];
    await req.client.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//deleting a client
router.delete("/:id", getClient, async (req, res) => {
  try {
    await res.client.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

async function DuplicatednameorEmail(req, res, next) {
  let client;
  try {
    client = await Client.findOne({ name: req.body.name });
    email = await Client.findOne({ email: req.body.email });
    if (client || email) {
      return res.status(404).send({ message: "name already exists" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
}
module.exports = router;
