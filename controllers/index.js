const db = require("../models");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/project3";
const defaultMongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

async function checkIfNameInUse (username) {
  // returns Boolean
  return getUserByName(username)
    .then(dbUser => !!dbUser);
}

async function getCode () {
  return db.Snippet.find().sort({ lastEdited: -1 });
}

async function getCodeByAuthorId (id) {
  return db.Snippet.find({ author: id });
}

async function getCodeByAuthorName (username) {
  return getUserByName(username)
    .then(({ _id }) => getCodeByAuthorId(_id));
}

async function getCodeById (id) {
  return db.Snippet.findById(id);
}

async function getUserByName (username) {
  return db.User.findOne({ username });
}

async function registerNewCode (authorId, codeObject) {
  return db.Snippet.create({ ...codeObject, author: authorId });
}

async function registerNewUser (userData, password) {
  return db.User.create(userData)
    .then(newUser => newUser.setPassword(password))
    .then(saltedUser => saltedUser.save())
    .catch(err => Promise.reject(err));
}

async function updateCodeById (codeId, codeObject) {
  return db.Snippet.findByIdAndUpdate(codeId, { ...codeObject, lastEdited: Date.now() });
}

async function updateLastLoginById (id) {
  return db.User.findById(id)
    .then(dbUser => dbUser.updateLoginAndSave())
    .catch(err => Promise.reject(err));
}

async function updateProfileData (id, newData) {
  return db.User.findByIdAndUpdate(id, newData, { new: true })
    .catch(err => Promise.reject(err));
}

module.exports = {
  checkIfNameInUse,
  connect: (uri = MONGODB_URI, options = defaultMongoOptions) =>
    mongoose.connect(uri, options),
  disconnect: () => mongoose.disconnect(),
  getCode,
  getCodeByAuthorId,
  getCodeByAuthorName,
  getCodeById,
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  getUserByName,
  registerNewCode,
  registerNewUser,
  updateCodeById,
  updateLastLoginById,
  updateProfileData
};
