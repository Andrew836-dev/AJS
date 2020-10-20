const db = require("../models");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/project3";
const defaultMongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

async function checkIfEmailInUse (email) {
  // returns Boolean
  return db.User.findOne({ email })
    .then(dbUser => !!dbUser);
}

async function checkIfNameInUse (name) {
  // returns Boolean
  return db.User.findOne({ name })
    .then(dbuser => !!dbuser);
}

async function getUserData (name) {
  return db.User.findOne({ name });
}

async function registerNewUser (name, email, password) {
  return db.User.create({ name, email })
    .then(newUser => newUser.setPassword(password))
    .then(saltedUser => saltedUser.save())
    .catch(err => Promise.reject(err));
}

async function updateLastLoginById (id) {
  return db.User.findById(id)
    .then(dbUser => dbUser.updateLoginAndSave())
    .catch(err => Promise.reject(err));
}

module.exports = {
  checkIfEmailInUse,
  checkIfNameInUse,
  connect: (uri = MONGODB_URI, options = defaultMongoOptions) =>
    mongoose.connect(uri, options),
  disconnect: () => mongoose.disconnect(),
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  getUserData,
  registerNewUser,
  updateLastLoginById
};
