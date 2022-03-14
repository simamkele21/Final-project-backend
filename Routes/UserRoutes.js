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
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// //Getting one accounts.
router.get("/:id", Client, (req, res) => {
  res.send(res.client);
});

// //signup
router.post("/Clients", async (req, res) => {
  const client = new Client(req.body.name, req.body.email, req.body.password);
  try {
    await client.save();
    const token = await client.generateAuthToken();
    res.status(201).send({ client, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// //login
router.post("/Clients/login", async (req, res) => {
  try {
    const client = await Client.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await client.generateAuthToken();
    res.send({ client, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// //logout
router.post("/Clients/logout", Auth, async (req, res) => {
  try {
    req.client.tokens = req.client.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.client.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// //logout All
router.post("/Clients/logoutAll", Auth, async (req, res) => {
  try {
    req.client.tokens = [];
    await req.client.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;


