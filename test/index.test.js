/* eslint-disable no-undef */
describe("Server tests for A.J.S.", function () {
  describe("Tests that need a Mongo server", () => {
    require("./mongo-dependant-tests/controllers.test");
    require("./mongo-dependant-tests/get-user-api-routes.test");
  });
  describe("Tests that stub the database", () => {
    require("./stubbed-tests/get-code-api-routes.test");
    require("./stubbed-tests/post-login-api-routes.mocks.test");
    require("./stubbed-tests/post-signup-api-routes.test");
  });
  describe("Tests that don't need external frameworks", () => {
    require("./no-external-dependancy-tests/post-login-api-routes.test");
  });
});
