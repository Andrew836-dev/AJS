const chai = require("chai")
const http = require("chai-http");
const { expect } = chai;

const sinon = require("sinon");
const controller = require("../controllers");

chai.use(http);
const { FIRST_USER } = require("./testUsers.json");

const { expressApp } = require("../app");
const appRequest = chai.request(expressApp);

describe("Express app export", function () {
  this.beforeAll(done => {
    appRequest.keepOpen()
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  describe("'/api/signup' POST route", function () {
    this.beforeAll(() => {
      sinon.createSandbox();
    });

    this.beforeEach(() => {
      sinon
        .stub(controller, "registerNewUser")
        .callsFake((name, email, password) => {
          // console.log("stub called");
          return Promise.resolve({ name, email, password });
        });
    });

    this.afterEach(() => {
      sinon.restore();
    });

    it("is a valid route", done => {
      appRequest
        .post("/api/signup")
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.not.have.status(404);
          done();
        });
    });

    it("returns status 400 with an empty email field", done => {
      appRequest
        .post("/api/signup")
        .send({ "email": "", "name": FIRST_USER.name, "password": FIRST_USER.password })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns status 400 with an empty name field", done => {
      appRequest
        .post("/api/signup")
        .send({ "email": FIRST_USER.email, "name": "", "password": FIRST_USER.password })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns status 400 with an all whitespace name field", done => {
      appRequest
        .post("/api/signup")
        .send({ "email": FIRST_USER.email, "name": "    ", "password": FIRST_USER.password })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns status 400 with an empty password field", done => {
      appRequest
        .post("/api/signup")
        .send({ "email": FIRST_USER.email, "name": FIRST_USER.name, "password": "" })
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns status 307 and redirects when all fields are valid and user is saved", done => {
      appRequest
        .post("/api/signup")
        .redirects(0)
        .send(FIRST_USER)
        .end((err, res) => {
          if (err) done(err);
          expect(res).header("location", "/api/login")
          expect(res).to.have.status(307);
          done();
        });
    });

    it("returns status 401 if the register function returns an error", done => {
      sinon.restore();
      sinon.stub(controller, "registerNewUser").callsFake(() => Promise.reject({}))
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
});