const app = require("./app");
const db = require("./controllers");

db.connect()
  .then(() => {
    console.log("Database connected -", db.getHostString());
    app.listen();
  });
