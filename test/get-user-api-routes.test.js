/* eslint-disable no-undef */
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

chai.use(chaiHttp);

const { expressApp } = require("../app");
const appRequest = chai.request(expressApp);

const db = require("../controllers");

const { FIRST_USER } = require("./testUsers.json");
const { GUEST_OBJECT } = require("../config/constants");

describe("User GET API routes", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
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
});
