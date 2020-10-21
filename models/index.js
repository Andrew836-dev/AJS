const mongoose = require("mongoose");

const db = {
  User: require("./User"),
  Snippet: require("./Snippet")
}

module.exports = db;
