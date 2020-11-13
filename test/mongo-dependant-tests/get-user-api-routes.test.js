/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const { expressApp } = require("../../app");
const appRequest = chai.request(expressApp);

const db = require("../../controllers");

const { FIRST_USER } = require("../testUsers.json");
const { GUEST_OBJECT } = require("../../config/constants");

describe("User GET API routes", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
    db.disconnect();
    appRequest.close();
  });

  describe("API route '/api/user_data' when not logged in", function () {
    this.beforeAll(done => {
      appRequest
        .get("/logout")
        .then(() => done())
        .catch(done);
    });

    it("does not return a 404", done => {
      appRequest
        .get("/api/user_data")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.not.have.status(404);
          done();
        });
    });

    it("returns a default GUEST user object", done => {
      appRequest
        .get("/api/user_data")
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.deep.equal(GUEST_OBJECT);
          done();
        });
    });
  });

  describe("route '/api/user_data' when logged in (requires mongo connection)", function () {
    const loggedInAgent = chai.request.agent(expressApp);
    this.beforeAll((done) => {
      db
        .connect("mongodb://localhost/test")
        .then(connection => connection.model("User").collection.drop())
        .catch(() => { /* This prevents test timing out if User collection doesn't exist */ })
        .then(() => db.registerNewUser(FIRST_USER, FIRST_USER.password))
        .then(() => done());
    });

    this.afterAll(() => {
      loggedInAgent.close();
      db.disconnect();
    });

    this.afterEach(done => {
      loggedInAgent
        .get("/logout")
        .end((err, res) => {
          if (err) done(err);
          done();
        });
    });

    it("returns active user details when logged in", function (done) {
      loggedInAgent
        .post("/api/login")
        .send(FIRST_USER)
        .then(() => loggedInAgent.get("/api/user_data"))
        .then(res => {
          expect(res.body).to.not.deep.equal(GUEST_OBJECT);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });

  describe("route '/logout' (requires mongo connection)", function () {
    const loggedInAgent = chai.request.agent(expressApp);
    this.beforeAll((done) => {
      db
        .connect("mongodb://localhost/test")
        .then(connection => connection.model("User").collection.drop())
        .catch(() => { /* This prevents test timing out if User collection doesn't exist */ })
        .then(() => db.registerNewUser(FIRST_USER, FIRST_USER.password))
        .then(() => done());
    });

    this.afterAll(() => {
      loggedInAgent.close();
      db.disconnect();
    });

    it("returns 200 regardless of logged in status", done => {
      loggedInAgent
        .get("/logout")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          done();
        });
    });

    it("logs you out if you are logged in", done => {
      loggedInAgent
        .post("/api/login")
        .send(FIRST_USER)
        .then(() => loggedInAgent.get("/logout"))
        .then(() => loggedInAgent.get("/api/user_data"))
        .then(res => {
          expect(res.body).to.deep.equal(GUEST_OBJECT);
          done();
        })
        .catch(done);
    });
  });
  describe("route '/api/profile' (requires mongo connection)", function () {
    this.beforeAll((done) => {
      db
        .connect("mongodb://localhost/test")
        .then(connection => connection.model("User").collection.drop())
        .catch(() => { /* This prevents test timing out if User collection doesn't exist */ })
        .then(() => db.registerNewUser(FIRST_USER, FIRST_USER.password))
        .then(() => done());
    });

    this.afterAll(() => {
      db.disconnect();
    });

    it("returns 400 when you have no 'username' parameter", done => {
      appRequest
        .get("/api/profile")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns 404 if the user isn't in the database", done => {
      appRequest
        .get("/api/profile/x")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          done();
        });
    });

    it("returns a profile object if the user is in the database", done => {
      appRequest
        .get("/api/profile/" + FIRST_USER.username)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.haveOwnProperty("_id");
          done();
        });
    });
  });
});
