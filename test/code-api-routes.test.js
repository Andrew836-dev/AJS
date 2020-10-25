/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

const { FIRST_USER } = require("./testUsers.json");

chai.use(http);

const { expressApp } = require("../app");
const appRequest = chai.request(expressApp);
const sinon = require("sinon");
const controllers = require("../controllers");

describe("API route GET '/api/author/:name'", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    sinon.createSandbox();
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  this.afterEach(() => {
    sinon.restore();
  });

  it("returns 400 with no parameter", done => {
    appRequest
      .get("/api/author")
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("returns status 404 when name not found", done => {
    sinon
      .stub(controllers, "getCodeByAuthorName")
      .callsFake(() => Promise.resolve(null));
    appRequest
      .get("/api/author/" + FIRST_USER.username)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(404);
        done();
      });
  });

  it("returns status 200 with match", done => {
    sinon
      .stub(controllers, "getCodeByAuthorName")
      .callsFake(() => Promise.resolve([]));
    appRequest
      .get("/api/author/" + FIRST_USER.username)
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        done();
      });
  });

  it("returns the item from the database on success", done => {
    const DUMMY_RESULT = ["ONE", "TWO"];
    sinon
      .stub(controllers, "getCodeByAuthorName")
      .callsFake(() => Promise.resolve(DUMMY_RESULT));
    appRequest
      .get("/api/author/" + FIRST_USER.username)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body).to.deep.equal(DUMMY_RESULT);
        done();
      });
  });
});
