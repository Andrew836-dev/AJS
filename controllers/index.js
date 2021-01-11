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

async function deleteCodeByIdAndAuthor (codeId, userId) {
  const dbSnippet = await getCodeById(codeId);
  if (!dbSnippet) {
    return { status: 404, deleted: false };
  }
  if (dbSnippet.author.toString() !== userId.toString()) {
    return { status: 403, deleted: false };
  }
  dbSnippet.remove();
  return { status: 200, deleted: true };
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
  return db.User.findByUsername(username);
}

async function registerNewCode (authorId, codeObject) {
  return db.Snippet.create({ ...codeObject, author: authorId });
}

async function registerNewUser (userData, password) {
  return db.User.register(userData, password);
}

async function updateCodeByIdAndAuthor (codeId, codeObject, authorId) {
  return db.Snippet.findOneAndUpdate({ _id: codeId, author: authorId }, { ...codeObject, lastEdited: Date.now() }, { new: true });
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
  deleteCodeByIdAndAuthor,
  disconnect: () => mongoose.disconnect(),
  getCode,
  getCodeByAuthorId,
  getCodeByAuthorName,
  getCodeById,
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  getUserByName,
  registerNewCode,
  registerNewUser,
  updateCodeByIdAndAuthor,
  updateLastLoginById,
  updateProfileData
};
