const controllers = require("../controllers");
const { body, param, validationResult } = require("express-validator");
// const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get(["/api/author", "/api/author/:name"],
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

  app.get("/api/code", (req, res) => {
    controllers.getCode()
      .then(dbCode => {
        if (Array.isArray(dbCode)) {
          return res.json(dbCode);
        }
        res.json([]);
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

  app.post(["/api/code", "/api/code/:id"],
    [
      param("id").notEmpty(),
      body("title").isString(),
      body("mode").isString(),
      body("body").isArray()
    ]
    , (req, res) => {
      if (!req.user) {
        return res.status(401).json({ errors: ["Not logged in."] });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (req.params.id === "new") {
        controllers.registerNewCode(req.user._id, req.body)
          .then(dbResponse => res.json(dbResponse))
          .catch(err => res.status(500).json(err));
      } else {
        controllers.updateCodeByIdAndAuthor(req.params.id, req.body, req.user._id)
          .then(dbResponse => {
            if (!dbResponse) res.status(403);
            res.json(dbResponse);
          })
          .catch(err => res.status(500).json(err));
      }
    });

  app.delete(["/api/code", "/api/code/:id"], [
    param("id").isMongoId().notEmpty()
  ], async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ errors: ["Not logged in."] });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const dbResponse = await controllers.deleteCodeByIdAndAuthor(req.params.id, req.user._id).catch(() => false);
    if (!dbResponse) {
      return res.status(500).json({ errors: ["Server error"] });
    }

    res.status(dbResponse.status).json(dbResponse.deleted);
  });
};
