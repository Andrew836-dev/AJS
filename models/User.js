const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: "Please enter a name"
  },
  email: {
    type: String,
    unique: true,
    validate: /.+@.+\..+/
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  currentLogin: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "User"
  }
});

UserSchema.methods.updateLoginAndSave = function () {
  const currentTime = Date.now();
  this.lastLogin = this.currentLogin;
  this.currentLogin = currentTime;
  return this.save();
};

UserSchema.plugin(passportLocalMongoose, { usernameField: "email", lastLoginField: "lastLogin" });

const User = mongoose.model("User", UserSchema);

module.exports = User;
