/* eslint-disable no-undef */
const controller = require("../../controllers");
const mongoose = require("mongoose");

const { FIRST_USER, SECOND_USER } = require("../testUsers.json");
const { FIRST_SNIPPET, SECOND_SNIPPET } = require("../testSnippets.json");
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || "mongodb://localhost/test";
const defaultMongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
const chai = require("chai");
const expect = chai.expect;

describe("Controller export", function () {
  this.beforeAll(done => {
    mongoose
      .disconnect()
      .then(() => done());
  });
  this.afterAll(done => {
    mongoose
      .disconnect()
      .then(() => done());
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
          expect(TEST_MONGODB_URI).to.include(stringUnderTest);
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
        }).catch(done);
    });
  });

  describe("registerNewUser() function", function () {
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
        // the actual error is a due to the collection not existing, which isn't a problem
        .catch(() => done());
    });

    it("Registers a new user", done => {
      controller
        .registerNewUser(FIRST_USER, FIRST_USER.password)
        .then(createdUser => {
          const nameReg = new RegExp(FIRST_USER.username);
          expect(createdUser.username).to.match(nameReg);
          done();
        })
        .catch(done);
    });

    it("Registers a second user when there is one already in the database", done => {
      controller
        .registerNewUser(FIRST_USER, FIRST_USER.password)
        .then(() => controller.registerNewUser(SECOND_USER, SECOND_USER.password))
        .then(secondUser => {
          const nameReg = new RegExp(SECOND_USER);
          expect(secondUser.username).to.match(nameReg);
          done();
        })
        .catch(done);
    });

    it("Throws if the username is a duplicate of one already in the database", done => {
      controller
        .registerNewUser(FIRST_USER, FIRST_USER.password)
        .then(() => controller.registerNewUser(FIRST_USER, SECOND_USER.password))
        .then(done)
        .catch((err) => {
          expect(err).to.be.instanceOf(Error);
          done();
        });
    });

    it("Throws if the username field is empty", done => {
      controller
        .registerNewUser({ username: "" }, FIRST_USER.password)
        .then(done)
        .catch(err => {
          expect(err).to.be.instanceOf(Error);
          done();
        });
    });

    it("Throws if the password field is empty", done => {
      controller
        .registerNewUser(FIRST_USER.username, "")
        .then(done)
        .catch(err => {
          expect(err).to.be.instanceOf(Error);
          done();
        });
    });

    it("Succeeds if the darkTheme option is absent", done => {
      controller
        .registerNewUser({ username: FIRST_USER.username }, FIRST_USER.password)
        .then(response => {
          expect(response.darkTheme).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
  describe("checkIfNameInUse() function", function () {
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
        // the actual error is a due to the collection not existing, which isn't a problem
        .catch(() => done());
    });

    it("returns a boolean true if name is in database", done => {
      controller
        .registerNewUser(FIRST_USER, FIRST_USER.password)
        .then(() => controller.checkIfNameInUse(FIRST_USER.username))
        .then(dbRes => {
          expect(dbRes).to.deep.equal(true);
          done();
        })
        .catch(done);
    });

    it("returns a boolean false if name is not in database", done => {
      controller
        .checkIfNameInUse(FIRST_USER.username)
        .then(dbRes => {
          expect(dbRes).to.deep.equal(false);
          done();
        })
        .catch(done);
    });
  });
  describe("getCode() function", function () {
    this.beforeAll(done => {
      mongoose
        .connect(TEST_MONGODB_URI, defaultMongoOptions)
        .then(() => done())
        .catch(done);
    });

    this.beforeEach(done => {
      mongoose.connection.dropCollection("snippets")
        .then(() => done())
        // this needs to be handled to prevent the test crashing
        // the actual error is a due to the collection not existing, which isn't a problem
        .catch(() => done());
    });

    it("returns an array", done => {
      controller
        .getCode()
        .then(dbRes => {
          expect(dbRes).to.be.instanceOf(Array);
          done();
        });
    });

    it("returns snippets in reverse date order (newest first)", done => {
      mongoose
        .model("Snippet")
        .insertMany([FIRST_SNIPPET, SECOND_SNIPPET])
        .then(() => controller.getCode())
        .then(dbRes => {
          expect(dbRes[0].lastEdited).to.be.greaterThan(dbRes[1].lastEdited);
          done();
        })
        .catch(done);
    });
  });
});
