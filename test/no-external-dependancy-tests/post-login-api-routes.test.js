/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

chai.use(http);
const { FIRST_USER } = require("../testUsers.json");

const { expressApp } = require("../../app");
const appRequest = chai.request(expressApp);

describe("API route '/api/login'", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  it("returns status 400 with no body data", done => {
    appRequest
      .post("/api/login")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with an empty username field", done => {
    appRequest
      .post("/api/login")
      .send({ username: "", password: FIRST_USER.password })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with an all whitespace username field", done => {
    appRequest
      .post("/api/login")
      .send({ username: "    ", password: FIRST_USER.password })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with an empty password field", done => {
    appRequest
      .post("/api/login")
      .send({ username: FIRST_USER.username, password: "" })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });
});
