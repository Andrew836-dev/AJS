module.exports = app => {
  require("./user-api-routes")(app);
  require("./code-api-routes")(app);
};
