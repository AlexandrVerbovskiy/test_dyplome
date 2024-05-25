const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const ReplyComment = require("../../models/replyComment");
const User = require("../../models/user");
const Job = require("../../models/job");
const JobComment = require("../../models/jobComment");

describe("ReplyComment Model", () => {
  let replyComment;
  let user;
  let job;
  let jobComment;
  let userId;
  let jobId;
  let jobCommentId;

  before(async () => {
    replyComment = new ReplyComment(db);
    user = new User(db);
    job = new Job(db);
    jobComment = new JobComment(db);
    userId = await user.create("test@example.com", "test@example.com");
    jobId = await job.create("test", 12, "test", "test", 12, 12, userId);
    const jobCommentInfo = await jobComment.create({
      senderId: userId,
      jobId,
      body: "test",
    });
    jobCommentId = jobCommentInfo.id;
  });

  after(async () => {
    await replyComment.dbQueryAsync("DELETE FROM reply_comments");
    await jobComment.dbQueryAsync("DELETE FROM  job_comments");
    await job.dbQueryAsync("DELETE FROM jobs");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new reply comment and return the insertId", async () => {
      const newReplyComment = {
        senderId: userId,
        parentId: jobId,
        parentType: "job",
        body: "Nice work!",
        replyCommentId: jobCommentId,
      };

      const comment = await replyComment.create(newReplyComment);
      expect(comment.id).to.be.a("number");
    });
  });
});
