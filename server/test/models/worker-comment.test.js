const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const WorkerComment = require("../../models/workerComment");
const User = require("../../models/user");

describe("WorkerComment Model", () => {
  let workerComment;
  let user;
  let userId;

  before(async () => {
    workerComment = new WorkerComment(db);
    user = new User(db);
    userId = await user.create("test@example.com", "test@example.com");
  });

  after(async () => {
    await user.dbQueryAsync("DELETE FROM worker_comments");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new comment and return the insertId", async () => {
      const newComment = {
        senderId: userId,
        workerId: userId,
        rating: 5,
        body: "Great worker!",
      };

      const comment = await workerComment.create(newComment);
      expect(comment.id).to.be.a("number");
    });
  });

  describe("getAverageStars", () => {
    it("should return the average rating of a worker's comments", async () => {
      const newComment = {
        senderId: userId,
        workerId: userId,
        rating: 5,
        body: "Great worker!",
      };

      const insertId = await workerComment.create(newComment);

      const averageRating = await workerComment.getAverageStars(userId);
      expect(averageRating.averageRating).to.be.a("number");
    });
  });
});
