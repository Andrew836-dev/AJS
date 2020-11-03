const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: "Please enter a Username"
  },
  displayName: {
    type: String
  },
  darkTheme: {
    type: Boolean,
    default: true
  },
  email: {
    type: String,
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

UserSchema.plugin(passportLocalMongoose, { lastLoginField: "lastLogin" });

const User = mongoose.model("User", UserSchema);

module.exports = User;
