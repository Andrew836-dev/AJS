/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

const sinon = require("sinon");
const mongoose = require("mongoose");

// this is a quick fix to make the tests possible without an in memory server
const authenticate = require("passport-local-mongoose/lib/authenticate");

chai.use(http);
const { FIRST_USER, FIRST_USER_SNAPSHOT } = require("./testUsers.json");

const { expressApp } = require("../app");
const appRequest = chai.request(expressApp);

describe("API route '/api/login' with mocked authentication", function () {
  this.beforeAll(done => {
    sinon.createSandbox();
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  this.afterEach(() => {
    sinon.restore();
  });

  it("returns status 200 with authentication success", done => {
    sinon
      .stub(mongoose.model("User"), "findByUsername")
      .callsFake(
        () => {
          const user = FIRST_USER_SNAPSHOT;
          user.select = () => FIRST_USER_SNAPSHOT;
          user.authenticate = (password) => (
            authenticate(
              user,
              password,
              {
                saltField: "salt",
                hashField: "hash",
                encoding: "hex",
                iterations: 25000,
                keylen: 512,
                digestAlgorithm: "sha256"
              }
            )
          );
          user.get = (field) => user[field];
          return Promise.resolve(user);
        }
      );

    appRequest
      .post("/api/login")
      .send(FIRST_USER)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        done();
      });
  });

  it("returns status 401 if the register function returns an error", done => {
    sinon
      .stub(mongoose.model("User"), "findByUsername")
      .callsFake(
        () => {
          const user = (FIRST_USER_SNAPSHOT);
          user.select = () => FIRST_USER_SNAPSHOT;
          user.authenticate = () => ("Error");
          user.get = (field) => user[field];
          return Promise.resolve(user);
        }
      );
    appRequest
      .post("/api/login")
      .send({ username: FIRST_USER.username, password: FIRST_USER.password + "X" })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(401);
        done();
      });
  });
});
