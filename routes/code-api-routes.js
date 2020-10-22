const controllers = require("../controllers");
const { body, param, validationResult } = require("express-validator");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/api/author/:name",
    [
      param("name").isString().notEmpty()
    ]
    , (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name: author } = req.params;
      controllers.getCodeByAuthorName(author)
        .then(dbCode => {
          if (!dbCode) {
            return res.status(404).json({ errors: author + " not found." });
          }
          res.json(dbCode);
        })
        .catch(() => {
          res.status(500).json({ errors: "Server error." });
        });
    });

  app.get("/api/code/:id",
    [
      param("id").isMongoId().notEmpty()
    ]
    , (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      controllers.getCodeById(req.params.id)
        .then(dbCode => {
          if (!dbCode) {
            return res.status(404).end();
          }
          res.json(dbCode);
        })
        .catch(dbErr => {
          res.status(400).end();
        });
    });

  app.post("/api/code/:id",
    [
      isAuthenticated,
      body().isArray()
    ]
    , (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
      }
      if (req.params.id === "new") {
        controllers.registerNewCode(req.user._id, req.body)
          .then(dbResponse => {
            res.json(dbResponse);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      } else {
        controllers.updateCodeById(req.params.id, req.body)
          .then(dbResponse => {
            console.log("update", dbResponse);
            res.json(dbResponse);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    });
};
