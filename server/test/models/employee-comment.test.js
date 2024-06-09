const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const EmployeeComment = require("../../models/employeeComment");
const User = require("../../models/user");

describe("EmployeeComment Model", () => {
  let employeeComment;
  let user;
  let userId;

  before(async () => {
    employeeComment = new EmployeeComment(db);
    user = new User(db);
    userId = await user.create("test@example.com", "test@example.com");
  });

  after(async () => {
    await user.dbQueryAsync("DELETE FROM employee_comments");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new employee comment and return the insertId", async () => {
      const newEmployeeComment = {
        senderId: userId,
        employeeId: userId,
        rating: 5,
        body: "Great employee!",
      };

      const comment = await employeeComment.create(newEmployeeComment);
      expect(comment.id).to.be.a("number");
    });
  });
});
