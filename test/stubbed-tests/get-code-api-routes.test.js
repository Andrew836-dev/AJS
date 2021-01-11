/* eslint-disable no-undef */
const chai = require("chai");
const http = require("chai-http");
const { expect } = chai;

const { FIRST_USER } = require("../testUsers.json");
const { FIRST_SNIPPET } = require("../testSnippets.json");

chai.use(http);
const { expressApp } = require("../../app");
const appRequest = chai.request(expressApp);
const sinon = require("sinon");
const controllers = require("../../controllers");

describe("Code API GET routes with fakes", function () {
  this.beforeAll(done => {
    appRequest.keepOpen();
    sinon.createSandbox();
    done();
  });

  this.afterAll(() => {
    appRequest.close();
  });

  describe("API route GET '/api/author/:name'", function () {
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
      const DUMMY_RESULT = [FIRST_SNIPPET];
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

  describe("API route GET '/api/code'", function () {
    this.afterEach(() => {
      sinon.restore();
    });

    it("returns any non-null object the database gives it", done => {
      sinon.stub(controllers, "getCode")
        .callsFake(() => Promise.resolve([{ name: "Dummy Object" }]));
      appRequest
        .get("/api/code")
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.deep.equal([{ name: "Dummy Object" }]);
          done();
        });
    });
    it("returns an empty array if the databse gives it a null object", done => {
      sinon.stub(controllers, "getCode")
        .callsFake(() => Promise.resolve(null));
      appRequest
        .get("/api/code")
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.deep.equal([]);
          done();
        });
    });
  });

  describe("API route GET '/api/code/:id'", function () {
    this.afterEach(() => {
      sinon.restore();
    });

    it("returns status 400 when ':id' param not a Mongo Id", done => {
      appRequest
        .get("/api/code/" + FIRST_USER.username)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(400);
          done();
        });
    });

    it("returns status 404 when Mongo Id not in database", done => {
      sinon
        .stub(controllers, "getCodeById")
        .callsFake(() => Promise.resolve(null));
      appRequest
        .get("/api/code/" + FIRST_SNIPPET._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(404);
          done();
        });
    });

    it("returns status 200 with match", done => {
      sinon
        .stub(controllers, "getCodeById")
        .callsFake(() => Promise.resolve([]));
      appRequest
        .get("/api/code/" + FIRST_SNIPPET._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res).to.have.status(200);
          done();
        });
    });

    it("returns the item from the database on success", done => {
      const DUMMY_RESULT = FIRST_SNIPPET;
      sinon
        .stub(controllers, "getCodeById")
        .callsFake(() => Promise.resolve(DUMMY_RESULT));
      appRequest
        .get("/api/code/" + FIRST_SNIPPET._id)
        .end((err, res) => {
          if (err) done(err);
          expect(res.body).to.deep.equal(DUMMY_RESULT);
          done();
        });
    });
  });
});
