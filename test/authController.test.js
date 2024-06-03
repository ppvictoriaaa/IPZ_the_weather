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

    // Перевірка, чи відбулася переадресація на сторінку реєстрації з повідомленням про успішну реєстрацію
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
      status: sinon.stub().returnsThis(),
      render: sinon.spy(),
      cookie: sinon.spy(),
      redirect: sinon.spy(),
    };

    await authController.login(req, res);

    // Перевірка, чи відбулася переадресація на головну сторінку після успішного входу
    assert(res.redirect.calledWith("/"));

    // Перевірка, чи було встановлено куку з токеном доступу
    assert(res.cookie.calledWith("jwt"));
  });
});

describe("Upload Profile Photo", () => {
  it("should upload a profile photo for the user", async () => {
    const req = {
      file: { filename: "test.jpg" },
      cookies: { jwt: "fakeToken" },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      redirect: sinon.spy(),
    };

    await authController.uploadPhoto(req, res);

    // Перевірка, чи відбулася коректна відповідь з новою фотографією профілю
    assert(
      res.json.calledWith({
        success: true,
        new_profile_photo: "/upload/test.jpg?t=",
      })
    );
  });
});

describe("Newsletter Subscription", () => {
  it("should subscribe a user to the newsletter", async () => {
    const req = {
      body: {
        email: "test@example.com",
        region: "New York",
        frequency: "daily",
      },
      cookies: { jwt: "fakeToken" },
    };
    const res = {
      redirect: sinon.spy(),
    };

    await authController.newsletter(req, res);

    // Перевірка, чи відбулася переадресація на сторінку підписки з повідомленням про успішну підписку
    assert(
      res.redirect.calledWith(
        "/newsletter?message=Newsletter created successfully"
      )
    );
  });
});
