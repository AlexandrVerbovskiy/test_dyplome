const chai = require("chai");
const assert = require("assert");
const db = require("../setup");
const PasswordResetLink = require("../../models/passwordResetLink");
const User = require("../../models/user");

describe("PasswordResetLinkModel", () => {
  let passwordResetLinkModel;
  let user;
  let userId;

  before(async () => {
    user = new User(db);
    passwordResetLinkModel = new PasswordResetLink(db);
    userId = await user.create("john@example.com", "john@example.com");
  });

  beforeEach(async () => {
    await passwordResetLinkModel.dbQueryAsync("DELETE FROM password_reset_links");
  });

  after(async () => {
    await passwordResetLinkModel.dbQueryAsync(
      "DELETE FROM password_reset_links"
    );
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("#getLinkByAccountId", () => {
    it("should return a password reset link for a given account ID", async () => {
      const resetToken = "test_token";
      await passwordResetLinkModel.createLink(userId, resetToken);

      const link = await passwordResetLinkModel.getLinkByAccountId(userId);

      assert.strictEqual(link.accountId, userId);
      assert.strictEqual(link.resetToken, resetToken);
    });
  });

  describe("#createLink", () => {
    it("should create a new password reset link", async () => {
      const resetToken = "test_token_2";

      await passwordResetLinkModel.createLink(userId, resetToken);

      const link = await passwordResetLinkModel.getLinkByAccountId(userId);

      assert.strictEqual(link.accountId, userId);
      assert.strictEqual(link.resetToken, resetToken);
    });
  });

  describe("#getLinkByToken", () => {
    it("should return a password reset link for a given reset token", async () => {
      const resetToken = "test_token_3";
      await passwordResetLinkModel.createLink(userId, resetToken);

      const link = await passwordResetLinkModel.getLinkByToken(resetToken);

      assert.strictEqual(link.accountId, userId);
      assert.strictEqual(link.resetToken, resetToken);
    });
  });

  describe("#deleteLink", () => {
    it("should delete a password reset link by its ID", async () => {
      const resetToken = "test_token_4";
      await passwordResetLinkModel.createLink(userId, resetToken);

      const link = await passwordResetLinkModel.getLinkByToken(resetToken);

      await passwordResetLinkModel.deleteLink(link.id);

      const deletedLink = await passwordResetLinkModel.getLinkByAccountId(
        userId
      );
      assert.strictEqual(deletedLink, undefined);
    });
  });
});
