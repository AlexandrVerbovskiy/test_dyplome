const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const JobComment = require("../../models/jobComment");
const User = require("../../models/user");
const Job = require("../../models/job");

describe("JobComment Model", () => {
  let jobComment;
  let user;
  let job;
  let userId;
  let jobId;

  before(async () => {
    jobComment = new JobComment(db);
    user = new User(db);
    job = new Job(db);
    userId = await user.create("test@example.com", "test@example.com");
    jobId = await job.create("test", 12, "test", "test", 12, 12, userId);
  });

  after(async () => {
    await jobComment.dbQueryAsync("DELETE FROM  job_comments");
    await job.dbQueryAsync("DELETE FROM jobs");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new comment and return the insertId", async () => {
      const newComment = {
        senderId: userId,
        jobId: jobId,
        body: "Great job!",
      };

      const comment = await jobComment.create(newComment);
      expect(comment.id).to.be.a("number");
    });
  });
});
