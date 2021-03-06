/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const { expressApp } = require("../../app");
const appRequest = chai.request(expressApp);

const db = require("../../controllers");

const { FIRST_USER, SECOND_USER } = require("../testUsers.json");
const { FIRST_SNIPPET } = require("../testSnippets.json");

describe("Code DELETE API routes", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
    db.disconnect();
    appRequest.close();
  });
  describe("API route DELETE '/api/code/:id' when not logged in", function () {
    this.beforeAll(done => {
      appRequest
        .get("/logout")
        .then(() => done())
        .catch(done);
    });

    it("returns status 401 when not logged in and id parameter provided", done => {
      appRequest
        .delete("/api/code/" + FIRST_SNIPPET._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(401);
          done();
        });
    });

    it("returns status 401 when not logged in and invalid id parameter provided", done => {
      appRequest
        .delete("/api/code/" + "invalidID")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(401);
          done();
        });
    });

    it("returns status 401 when not logged in and no id parameter provided", done => {
      appRequest
        .delete("/api/code")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe("API route DELETE '/api/code/:id' when logged in", function () {
    const loggedInAgent = chai.request.agent(expressApp);
    let dbConnection;

    this.timeout(4000);
    this.beforeAll((done) => {
      db
        .connect("mongodb://localhost/test")
        .then(connection => {
          dbConnection = connection;
          return connection.model("User").collection.drop();
        })
        .catch(() => { /* This prevents test timing out if User collection doesn't exist */ })
        .then(() => db.registerNewUser(FIRST_USER, FIRST_USER.password))
        .then(() => db.registerNewUser(SECOND_USER, SECOND_USER.password))
        .then(() => done());
    });

    this.afterAll(() => {
      loggedInAgent.close();
      db.disconnect();
    });

    this.beforeEach(async () => {
      await dbConnection.model("Snippet").collection.drop()
        .catch(() => { /* This prevents test timing out if User collection doesn't exist */ });
    });

    this.afterEach(done => {
      loggedInAgent
        .get("/logout")
        .end((err, res) => {
          if (err) done(err);
          done();
        });
    });

    it("returns 400 if there is no id parameter", done => {
      loggedInAgent.post("/api/login").send(FIRST_USER)
        .then(() => loggedInAgent.delete("/api/code"))
        .then(res => {
          expect(res).to.have.status(400);
          done();
        })
        .catch(done);
    });

    it("returns 400 if there is an invalid id parameter", done => {
      loggedInAgent.post("/api/login").send(FIRST_USER)
        .then(() => loggedInAgent.delete("/api/code/" + "invalidID"))
        .then(res => {
          expect(res).to.have.status(400);
          done();
        })
        .catch(done);
    });

    it("deletes an existing snippet if the author is the user making the request", done => {
      loggedInAgent.post("/api/login").send(FIRST_USER)
        .then(() => loggedInAgent.post("/api/code/new").send({ ...FIRST_SNIPPET, author: "bob" }))
        .then(({ body }) => loggedInAgent.delete("/api/code/" + body._id))
        .then(dbRes => {
          expect(dbRes).to.have.status(200);
          done();
        })
        .catch(done);
    });

    it("returns 403 if the author is not the user making the delete request", done => {
      loggedInAgent.post("/api/login").send(FIRST_USER)
        .then(() => loggedInAgent.post("/api/code/new").send(FIRST_SNIPPET))
        .then(() => loggedInAgent.get("/logout"))
        .then(() => loggedInAgent.post("/api/login").send(SECOND_USER))
        .then(() => loggedInAgent.delete("/api/code/" + FIRST_SNIPPET._id))
        .then(res => {
          expect(res).to.have.status(403);
          done();
        })
        .catch(done);
    });
  });
});
