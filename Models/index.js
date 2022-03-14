const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.client = require("./UserModel");
db.role = require("./RoleModel");
db.ROLES = ["client", "admin"];
module.exports = db;
