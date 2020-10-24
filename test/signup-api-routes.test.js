/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

const sinon = require("sinon");
const controller = require("../controllers");

chai.use(http);
const { FIRST_USER } = require("./testUsers.json");

const { expressApp } = require("../app");
const appRequest = chai.request(expressApp);

describe("API route '/api/signup'", function () {
  this.beforeAll(done => {
    sinon.createSandbox();
    appRequest.keepOpen();
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  this.beforeEach(() => {
    sinon
      .stub(controller, "registerNewUser")
      .callsFake((username, password) => {
        return Promise.resolve({ username, password });
      });
  });

  this.afterEach(() => {
    sinon.restore();
  });

  it("Doesn't return 404", done => {
    appRequest
      .post("/api/signup")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.not.have.status(404);
        done();
      });
  });

  it("returns status 400 with an empty username field", done => {
    appRequest
      .post("/api/signup")
      .send({ username: "", password: FIRST_USER.password })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with an all whitespace username field", done => {
    appRequest
      .post("/api/signup")
      .send({ username: "    ", password: FIRST_USER.password })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with an empty password field", done => {
    appRequest
      .post("/api/signup")
      .send({ username: FIRST_USER.username, password: "" })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 400 with a four character password", done => {
    appRequest
      .post("/api/signup")
      .send({ username: FIRST_USER.username, password: "1234" })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });
  it("returns a non 400 status with five character password field", done => {
    appRequest
      .post("/api/signup")
      .redirects(0)
      .send({ username: FIRST_USER.username, password: "12345" })
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.not.have.status(400);
        done();
      });
  });

  it("returns status 307 and redirects when all fields are valid and register function returns non-error", done => {
    appRequest
      .post("/api/signup")
      .redirects(0)
      .send(FIRST_USER)
      .end((err, res) => {
        if (err) done(err);
        expect(res).header("location", "/api/login");
        expect(res).to.have.status(307);
        done();
      });
  });

  it("returns status 401 if the register function returns an error", done => {
    sinon.restore();
    sinon.stub(controller, "registerNewUser").callsFake(() => Promise.reject(Error("Throwing an error")));
    appRequest
      .post("/api/signup")
      .send(FIRST_USER)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(401);
        done();
      });
  });
});
