const controller = require("../controllers");
const mongoose = require("mongoose");
const db = require("../models");

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || "mongodb://localhost/test";
const defaultMongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
const chai = require("chai");
const expect = chai.expect;

describe("Controller export", function () {
  this.afterAll(() => {
    mongoose.disconnect();
  });

  describe("getHostString() function", function () {
    it("Is a function that returns current host as a string", () => {
      expect(controller.getHostString()).to.be.a("string");
    });

    it("Returns 'Not connected' when not connected", done => {
      mongoose
        .disconnect()
        .then(() => {
          expect(controller.getHostString()).to.match(/Not connected/);
          done();
        })
        .catch(done);
    });

    it("Returns host name when connected", done => {
      mongoose
        .connect(TEST_MONGODB_URI, defaultMongoOptions)
        .then(() => {
          const stringUnderTest = controller.getHostString();
          expect(TEST_MONGODB_URI).to.include(stringUnderTest)
          done();
        })
        .catch(done);
    });
  });

  describe("connect() function", function () {
    this.beforeEach(done => {
      mongoose.disconnect().then(() => done());
    });

    this.afterAll(done => {
      mongoose.disconnect().then(() => done());
    });

    it("Has a method that connects to the MongoDB server", done => {
      controller
        .connect(TEST_MONGODB_URI, defaultMongoOptions)
        .then(() => {
          expect(mongoose.connection._readyState).to.equal(mongoose.STATES.connected);
          mongoose.disconnect().then(() => done());
        }).catch(done);
    });

    it("Has my chosen default options as a default parameter", done => {
      controller
        .connect(TEST_MONGODB_URI)
        .then(() => {
          const connectionOptions = mongoose.connection._connectionOptions;
          expect(connectionOptions.useNewUrlParser).to.equal(defaultMongoOptions.useNewUrlParser);
          expect(connectionOptions.useUnifiedTopology).to.equal(defaultMongoOptions.useUnifiedTopology);
          expect(mongoose.connection.config.useCreateIndex).to.equal(defaultMongoOptions.useCreateIndex);
          done();
        })
        .catch(done);
    });
  });

  describe("disconnect() function", function () {
    it("Has a method that disconnects from the MongoDB server", done => {
      mongoose
        .connect(TEST_MONGODB_URI, defaultMongoOptions)
        .then(() => controller.disconnect())
        .then(() => {
          expect(mongoose.connection._readyState).to.equal(mongoose.STATES.disconnected);
          done();
        }).catch(done)
    });
  });

  describe("registerNewUser() function", function () {
    const FIRST_USERNAME = "Teddy";
    const FIRST_EMAIL = "teddy@example.com";
    const FIRST_PASSWORD = "teddypass";
    const SECOND_USERNAME = "John";
    const SECOND_EMAIL = "john.gammel@gmail.com";
    const SECOND_PASSWORD = "joHnGL1v3s";
    const UNUSED_PASSWORD = "NotAPassword";

    this.beforeAll(done => {
      mongoose
        .connect(TEST_MONGODB_URI, defaultMongoOptions)
        .then(() => done())
        .catch(done);
    });

    this.beforeEach(done => {
      mongoose.connection.dropCollection("users")
        .then(() => done())
        // this needs to be handled to prevent the test crashing
        // the actual error isn't a problem
        .catch(() => done());
    });

    it("Registers a new user", done => {
      controller
        .registerNewUser(FIRST_USERNAME, FIRST_EMAIL, FIRST_PASSWORD)
        .then(createdUser => {
          const nameReg = new RegExp(FIRST_USERNAME);
          const emailReg = new RegExp(FIRST_EMAIL);
          expect(createdUser.name).to.match(nameReg);
          expect(createdUser.email).to.match(emailReg);
          done()
        })
        .catch(done);
    });

    it("Fails if the email is already in the system", done => {
      db.User
        .create({ name: FIRST_USERNAME, email: FIRST_EMAIL })
        .then(() => controller
          .registerNewUser(FIRST_USERNAME, FIRST_EMAIL, FIRST_PASSWORD))
        .catch(err => {
          expect(err).to.be.instanceOf(Error);
          done();
        });
    });
  });
});