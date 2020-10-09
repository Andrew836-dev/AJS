const db = require("../models");
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/test";
const defaultOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };

function checkIfEmailInUse(email) {
  return db.User.findOne({ email }).then(dbUser => !!dbUser);
}
module.exports = {
  connect: (uri = MONGODB_URI, options = defaultOptions) => mongoose.connect(uri, options),
  getHostString: () => mongoose.connection.host ? mongoose.connection.host : "Not connected",
  registerNewUser: (name, email, password) => (
    checkIfEmailInUse(email)
      .then(emailIsUsed => emailIsUsed ?
        Promise.reject({ message: "email is already in use" })
        : db.User.create({ name, email }))
      .then(newUser => newUser.setPassword(password))
      .then(saltedUser => saltedUser.save())
      .catch(err => Promise.reject(err)
      )
  ),
  checkIfEmailInUse
}