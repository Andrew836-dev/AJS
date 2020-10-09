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
  last: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(passportLocalMongoose, {usernameField: "email"});

const User = mongoose.model("User", UserSchema);

module.exports = User;


