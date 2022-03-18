const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { check } = require("express-validator");
const verifyToken = require("../Middleware/Auth");
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
router.post("/signup", DuplicatednameorEmail, async (req, res, next) => {
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

router.post("/login", async (req, res) => {
  try {
    const client = await Client.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await Client.generateAuthToken();
    res.json({ client, token });
  } catch (err) {
    res.status(400).send({ message: "Invalid user" });
  }
});
// router.post("/login", async (req, res) => {
//   try {
//     Client.findOne({ name: req.body.name}, (err, client) => {
//       if (err) return handleError(err);
//       id (!customer) {
//         return res.status(404).send({ message: "No client found"});
//       }
//       let passwordIsValid = bcrypt.compare(
//         req.body.password,
//         client.password
//       );
//       if (passwordIsValid){
//         return res.status(401).send({ 
//           accessToken: null,
//           message: "Invalid Password!", 
//         });
//       }

//       console.log(process.env.ACCESS_TOKEN_SECRET)
//       let token = jwt.sign({ id: client.id }, process.env.ACCESS_TOKEN_SECRET,{
//         expiresIn: "72h"
//       });
//       res.status(200).send({ 
//         id: client.id,
//         name: client.name, 
//         email: client.email,
//         password: client.password,
//         phoneNumber: client.phoneNumber,
//         cart: client.cart,
//         accessToken: token
//       });
//     });
//   }catch(err){
//     res.status(400).json({ message: err.message });
//   }
// });

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

//deleting a client
router.delete("/:id", getClient, async (req, res) => {
  try {
    await res.client.remove();
    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
