const db = require("../models");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/project3";
const defaultMongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

async function checkIfEmailInUse (email) {
  // returns Boolean
  return db.User.findOne({ email })
    .then(dbUser => !!dbUser);
}

async function checkIfNameInUse (name) {
  // returns Boolean
  return getUserByName(name)
    .then(dbUser => !!dbUser);
}

async function getCodeByAuthorId (id) {
  return db.Snippet.find({ author: id });
}

async function getCodeByAuthorName (name) {
  return getUserByName(name)
    .then(({ _id }) => getCodeByAuthorId(_id));
}

async function getCodeById (id) {
  return db.Snippet.findById(id);
}

async function getUserByName (name) {
  return db.User.findOne({ name });
}

async function registerNewCode (authorId, codeArray) {
  return db.Snippet.create({ author: authorId, body: codeArray });
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
  getCodeByAuthorId,
  getCodeByAuthorName,
  getCodeById,
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  getUserByName,
  registerNewCode,
  registerNewUser,
  updateCodeById,
  updateLastLoginById
};
