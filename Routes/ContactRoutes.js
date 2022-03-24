const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config()


router.get("/", (req, res) => {
  res.send({ message: "For Contact only POST method accepted" });
});

router.post("/", (req, res) => {
  let { name, surname, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: "Simamkelejanuary@gmail.com",
    subject: "New Contact from Artisticly Deadly Online store",
    text: `${(name, surname)} has contacted you 
  
  please contact them back on and ${email}
  ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(400).send({ msg: "Email not sent " + error });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Email sent successfull" });
    }
  });
});
module.exports = router;
