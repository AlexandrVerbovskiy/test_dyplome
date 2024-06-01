const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const User = require("../../models/user");

describe("User Model", () => {
  let userModel;
  let testUserId;

  before(async () => {
    userModel = new User(db);
    testUserId = await userModel.create("test@example.com", "test@example.com");
  });

  after(async () => {
    await userModel.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new user and return the insertId", async () => {
      const email = "testCreate@example.com";
      const password = "password";
      const insertId = await userModel.create(email, password);
      expect(insertId).to.be.a("number");
    });

    it("should throw an error if email is already registered", async () => {
      const email = "testCreate@example.com";
      const password = "password";
      try {
        await userModel.create(email, password);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("findByEmail", () => {
    it("should return user by email", async () => {
      const email = "test@example.com";
      const foundUser = await userModel.findByEmail(email);
      expect(foundUser).to.exist;
    });

    it("should return undefined if user is not found by email", async () => {
      const email = "nonexistent@example.com";
      const foundUser = await userModel.findByEmail(email);
      expect(foundUser).to.be.undefined;
    });
  });

  describe("findByPasswordAndEmail", () => {
    it("should return user if email and password are correct", async () => {
      const email = "test@example.com";
      const password = "test@example.com";
      const foundUser = await userModel.findByPasswordAndEmail(email, password);
      expect(foundUser).to.exist;
    });

    it("should throw an error if email is incorrect", async () => {
      const email = "nonexistent@example.com";
      const password = "test@example.com";
      try {
        await userModel.findByPasswordAndEmail(email, password);
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should throw an error if password is incorrect", async () => {
      const email = "test@example.com";
      const password = "incorrectpassword";
      try {
        await userModel.findByPasswordAndEmail(email, password);
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("getUserInfo", () => {
    it("should return user info by userId", async () => {
      const userInfo = await userModel.getUserInfo(testUserId);
      expect(userInfo).to.exist;
    });

    it("should return undefined if user is not found by userId", async () => {
      const userId = -1;
      const userInfo = await userModel.getUserInfo(userId);
      expect(userInfo).to.be.undefined;
    });
  });

  describe("getFullUserInfo", () => {
    it("should return full user info by userId", async () => {
      const fullUserInfo = await userModel.getFullUserInfo(testUserId);
      expect(fullUserInfo).to.exist;
    });

    it("should return undefined if user is not found by userId", async () => {
      const userId = -1;
      const fullUserInfo = await userModel.getFullUserInfo(userId);
      expect(fullUserInfo).to.be.undefined;
    });
  });

  describe("checkIsAdmin", () => {
    it("should return false if user is not an admin", async () => {
      const isAdmin = await userModel.checkIsAdmin(testUserId);
      expect(isAdmin).to.be.equal(0);
    });

    it("should return false if user is not found", async () => {
      const userId = -1;
      const isAdmin = await userModel.checkIsAdmin(userId);
      expect(isAdmin).to.be.undefined;
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile data", async () => {
      const profileData = {
        email: "newemail@example.com",
        nick: "newnick",
        address: "newaddress",
        avatar: "newavatar",
        lat: 0,
        lng: 0,
        activityRadius: 10,
        authorized: true,
        admin: true,
        balance: 100,
        phone: "1234567890",
        biography: "newbiography",
        instagramUrl: "newinstagram",
        linkedinUrl: "newlinkedin",
      };
      await userModel.updateUserProfile(testUserId, profileData);
      const updatedUser = await userModel.getFullUserInfo(testUserId);
      expect(updatedUser).to.exist;
    });
  });

  describe("createFull", () => {
    it("should insert a new user with full profile data", async () => {
      const profileData = {
        email: "newuser@example.com",
        nick: "newuser",
        address: "newaddress",
        avatar: "newavatar",
        lat: 0,
        lng: 0,
        activityRadius: 10,
        authorized: true,
        admin: true,
        balance: 100,
        phone: "1234567890",
        biography: "newbiography",
        instagramUrl: "newinstagram",
        linkedinUrl: "newlinkedin",
        password:"12312312"
      };
      const insertId = await userModel.createFull(profileData);
      expect(insertId).to.be.a("number");
    });
  });

  describe("changeAuthorized", () => {
    it("should toggle user authorization status", async () => {
      const initialAuthorized = await userModel.getUserInfo(testUserId)
        .profileAuthorized;
      const newAuthorized = await userModel.changeAuthorized(testUserId);
      expect(newAuthorized).to.not.equal(initialAuthorized);
    });
  });

  describe("changeRole", () => {
    it("should toggle user role between admin and non-admin", async () => {
      const initialAdmin = await userModel.getUserInfo(testUserId).admin;
      const newAdmin = await userModel.changeRole(testUserId);
      expect(newAdmin).to.not.equal(initialAdmin);
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      await userModel.delete(testUserId);
      const deletedUser = await userModel.getFullUserInfo(testUserId);
      expect(deletedUser).to.be.undefined;
    });
  });

  describe("updatePassword", () => {
    it("should update user password", async () => {
      const newPassword = "newpassword";
      await userModel.updatePassword(testUserId, newPassword);
    });
  });
});
