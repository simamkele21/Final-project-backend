const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const verifyToken = require("../Middleware/Auth");
const Client = require("../Models/UserModel");

// async function getClient(req, res, next) {
//   let client;
//   try {
//     client = await Client.findById(req.params.id);
//     if (client == null) {
//       return res.status(404).json({ message: "Cannot find Client" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }

//   res.client = client;
//   next();
// }

// async function DuplicatednameorEmail(req, res, next) {
//   let client;
//   try {
//     client = await Client.findOne({ name: req.body.name });
//     email = await Client.findOne({ email: req.body.email });
//     if (client || email) {
//       return res.status(404).send({ message: "name already exists" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
//   next();
// }

// async function findByCredentials(req, res, next) {
//   let client;
//   try {
//     email = await Client.findOne({ email: req.body.email });
//     password = await Client.findOne({ password: req.body.password });
//     if (client || email) {
//       return res.status(404).send({ message: "successfully loged-in" });
//     }
//   } catch (err) {
//     return res.status(500).send({ message: "Invalid user" });
//   }
//   next();
// }

// // //Getting all clients.
// router.get("/", async (req, res) => {
//   try {
//     const clients = await Client.find();
//     res.json(clients);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// });

// // //Getting one account.
// router.get("/:id", Client, (req, res) => {
//   res.send(res.client);
// });

// // //signup
// router.post("/signup", DuplicatednameorEmail, async (req, res, next) => {
//   const salt = await bcrypt.genSalt();
//   const hashedPassword = await bcrypt.hash(req.body.password, salt);
//   const client = new Client({
//     name: req.body.name,
//     email: req.body.email,
//     password: hashedPassword,
//     phone_number: req.body.phone_number,
//   });
//   try {
//     const newClient = await client.save();
//     // res.status(201).json(newClient);
//     res.status(200).send({ message: "Created new client" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // //login
// router.post("/login", findByCredentials, async (req, res) => {
//   try {
//     const client = await Client.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     const token = await Client.generateAuthToken();
//     res.json({ client, token });
//   } catch (err) {
//     res.status(400).send({ message: "Invalid user" });
//   }
// });

// // //logout
// router.post("/logout", async (req, res) => {
//   try {
//     req.client.tokens = req.client.tokens.filter((token) => {
//       return token.token !== req.token;
//     });
//     await req.client.save();
//     res.send({ message: "Client logged out" });
//   } catch (err) {
//     res.status(500).send({ message: "failed logging client out" });
//   }
// });

// // //logout All
// // router.post("/logoutAll", async (req, res) => {
// //   try {
// //     req.client.tokens = [];
// //     await req.client.save();
// //     res.send({ message: "Successfully logged clients out" });
// //   } catch (err) {
// //     res.status(500).send({ message: "failed logging clients out" });
// //   }
// // });

// //deleting a client
// router.delete("/:id", getClient, async (req, res) => {
//   try {
//     await res.client.remove();
//     res.json({ message: "Deleted User" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid address").isEmpty(),
    check(
      "password",
      "Please enter password within 6 or more chracters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResults(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ err: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await Client.findOne({ email });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Client already exists",
            },
          ],
        });
      }
      client = new Client({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        phoneNumber: req.body.phone_number,
      });

      const salt = await bcrypt.genSalt(10);
      clients.password = await bcrypt.hash(password, salt);
      await client.save();
    } catch (err) {}
  }
);
module.exports = router;
