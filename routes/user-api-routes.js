const { body, validationResult } = require("express-validator");
const { PASSWORD_MIN_LENGTH } = require("../config/constants");
// Requiring our models and passport as we've configured it
const controllers = require("../controllers");
const passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login",
    [
      body("username").trim().notEmpty().escape(),
      body("password").isLength({ min: PASSWORD_MIN_LENGTH }),
      passport.authenticate("local")
    ],
    (req, res) => {
      const { _id, role, username } = req.user;
      controllers.updateLastLoginById(_id);
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        role: role,
        username: username,
        id: _id
      });
    });

  // Route for signing up a user. The user data is validated and sanitized thanks to express-validator middleware.
  // The user's password is automatically hashed and stored securely thanks to passport-local-mongoose middleware.
  // If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup",
    [
      body("username").trim().notEmpty().escape(),
      body("password").isLength({ min: PASSWORD_MIN_LENGTH }),
      body("darkTheme").isBoolean()
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, password, darkTheme } = req.body;
      const userData = { username, darkTheme };
      controllers.registerNewUser(userData, password)
        .then(() => {
          return res.redirect(307, "/api/login");
        })
        .catch(err => res.status(401).json(err));
    });

  app.put("/api/user", (req, res) => {
    const { user, body } = req;
    if (!user) {
      return res.status(401).send({});
    }
    if (!body) {
      return res.status(400).send({});
    }
    controllers
      .updateProfileData(user._id, body)
      .then(dbUser => {
        if (!dbUser) {
          return res.status(404).send({});
        }
        // passport.serializeUser(dbUser)
        res.send(dbUser);
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/profile/:username", (req, res) => {
    const usernameParam = req.params.username;
    controllers.getUserByName(usernameParam)
      .then(dbUser => {
        if (!dbUser) {
          return res.status(404).end();
        }
        res.json(dbUser);
      });
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back the default GUEST options
      res.json({ darkTheme: true, username: "", role: "GUEST", id: "" });
    } else {
      // Otherwise send back the user's name and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        darkTheme: req.user.darkTheme,
        username: req.user.username,
        role: req.user.role,
        id: req.user._id
      });
    }
  });
};
