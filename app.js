const path = require("path");
const passport = require("./config/passport");
const session = require("express-session");
const express = require("express");
const logger = require("morgan");
const helmet = require("helmet");

const app = express();
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(helmet());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({ secret: "onamatapaeia", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/user-api-routes")(app);

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
