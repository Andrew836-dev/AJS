/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

const sinon = require("sinon");
const mongoose = require("mongoose");

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
      .callsFake(() => {
        return mongoose
          .model("User")(FIRST_USER)
          .setPassword(FIRST_USER.password);
      });

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
      .callsFake(() => {
        return mongoose
          .model("User")(FIRST_USER)
          .setPassword(FIRST_USER.password);
      });

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
