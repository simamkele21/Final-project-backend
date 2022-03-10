const mongoose = require(mongoose);
const validator = require(validator);
const bcrypt = require(bcryptjs);
const jwt = require(jsonwebtoken);

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid ");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Incorrect password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

clientSchema.methods.generateAuthToken = async function () {
  const client = this;
  const token = jwt.sign(
    { _id: client._id.toString() },
    process.env.JWT_SECRET
  );
  client.tokens = client.tokens.concat({ token });
  await client.save();
  return token;
};

clientSchema.statics.findByCredentials = async (email, password) => {
  const client = await Client.findOne({ email });
  if (!client) {
    throw new Error("Unable to log in");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return client;
};

clientSchema
  .pre("save", async function (next) {
    const client = this;
    if (client.isModified("password")) {
      client.password = await bcrypt.hash(client.password, 8);
    }
    next();
  })
  .pre("save", async function (next) {
    const client = this;
    if (client.isModified("password")) {
      client.password = await bcrypt.hash(client.password, 8);
    }
    next();
  });

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
