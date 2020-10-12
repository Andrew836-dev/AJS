const db = require("../models");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/project3";
const defaultOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

async function checkIfEmailInUse(email) {
  return db.User.findOne({ email }).then(dbUser => !!dbUser);
}

async function checkIfNameInUse(name) {
  return db.User.findOne({ name }).then(dbuser => !!dbuser);
}

async function registerNewUser(name, email, password) {
  return db.User.create({ name, email })
    .then(newUser => newUser.setPassword(password))
    .then(saltedUser => saltedUser.save())
    .catch(err => Promise.reject(err));
}


module.exports = {
  connect: (uri = MONGODB_URI, options = defaultOptions) => mongoose.connect(uri, options),
  disconnect: () => mongoose.disconnect(),
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  registerNewUser,
  checkIfEmailInUse,
  checkIfNameInUse
}