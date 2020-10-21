const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SnippetSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mode: {
    type: String,
    default: "javascript"
  },
  title: {
    type: String,
    default: "Untitled"
  },
  body: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
});

const Snippet = mongoose.model("Snippet", SnippetSchema);

module.exports = Snippet;
