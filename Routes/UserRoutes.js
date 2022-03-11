const express = require("express");
const Client = require("../Models/UserModel");
const Auth = require("../Middleware/Auth");
const router = new express.Router();

//Getting all accounts.
router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Getting one accounts.
router.get("/:id", getClient, (req, res) => {
  res.send(res.client);
});

//signup
router.post("/clients", async (req, res) => {
  const client = new Client(req.body);
  try {
    await client.save();
    const token = await client.generateAuthToken();
    res.status(201).send({ client, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//login
router.post("/clients/login", async (req, res) => {
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

//logout
router.post("/clients/logout", Auth, async (req, res) => {
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

//logout All
router.post("/clients/logoutAll", Auth, async (req, res) => {
  try {
    req.client.tokens = [];
    await req.client.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
