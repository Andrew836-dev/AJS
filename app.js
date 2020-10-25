const path = require("path");
const passport = require("./config/passport");
const session = require("express-session");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

const SCRIPT_HASH = process.env.SCRIPT_HASH || "";
const STYLE_HASH_ONE = process.env.STYLE_HASH_ONE || "";
const STYLE_HASH_TWO = process.env.STYLE_HASH_TWO || "";
const app = express();

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({ secret: "onamatapaeia", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "block-all-mixed-content": [],
        "font-src": ["'self'", "https:", "data:"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:", "https:"],
        "object-src": ["'none'"],
        "script-src": ["'self'"],
        "script-src-elem": ["'self'", SCRIPT_HASH],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "style-src-elem": ["'self'", STYLE_HASH_ONE, STYLE_HASH_TWO, "fonts.googleapis.com"],
        "upgrade-insecure-requests": []
      }
    }
  })
);

// adding all API routes here
require("./routes")(app);

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

module.exports = {
  expressApp: app,
  listen: function () {
    const PORT = process.env.PORT || 3001;
    return app.listen(PORT, function () {
      console.log(`🌎 ==> API server now on port ${PORT}!`);
    });
  }
};
