const assert = require("assert");
const sinon = require("sinon");
const authController = require("../controllers/auth");

describe("User Registration", () => {
  it("should register a new user", async () => {
    const req = {
      body: {
        username: "testUser",
        email: "test@example.com",
        password: "password",
        passwordConfirm: "password",
      },
    };
    const res = {
      render: sinon.spy(),
    };

    await authController.register(req, res);

    assert(res.render.calledWith("register", { message: "User registered" }));
  });
});

describe("User Login", () => {
  it("should log in an existing user", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password",
      },
    };
    const res = {
      render: sinon.spy(),
      cookie: sinon.spy(),
      redirect: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };

    await authController.login(req, res);

    assert(res.redirect.calledWith("/"));
    assert(res.cookie.calledWith("jwt"));
    assert(res.status.calledWith(200));
  });
});
