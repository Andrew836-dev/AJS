const controllers = require("../controllers");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/api/code/:id", (req, res) => {
    if (!req.params.id) {
      return res.status(400).end();
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

  app.post("/api/code/:id", isAuthenticated, (req, res) => {
    console.log(req.params, req.body);
    if (req.params.id === "new") {
      controllers.registerNewCode(req.user._id, req.body)
        .then(dbResponse => {
          console.log("new", dbResponse);
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
