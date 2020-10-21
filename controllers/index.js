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

async function getCodeById (id) {
  return db.Snippet.findById(id);
}

async function getUserData (name) {
  return db.User.findOne({ name });
}

async function registerNewCode (authorId, codeArray) {
  return db.Snippet.create({ author: authorId, body: codeArray }).then(console.log);
}

async function registerNewUser (name, email, password) {
  return db.User.create({ name, email })
    .then(newUser => newUser.setPassword(password))
    .then(saltedUser => saltedUser.save())
    .catch(err => Promise.reject(err));
}

async function updateCodeById (codeId, codeArray) {
  return db.Snippet.findByIdAndUpdate(codeId, { body: codeArray, lastEdited: Date.now() });
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
  getCodeById,
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  getUserData,
  registerNewCode,
  registerNewUser,
  updateCodeById,
  updateLastLoginById
};
