const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const Job = require("../../models/job");
const JobRequest = require("../../models/jobProposal");
const User = require("../../models/user");

describe("JobProposal Model", () => {
  let job;
  let jobProposal;
  let user;
  let jobId;
  let workerId;
  let employeeId;

  before(async () => {
    jobProposal = new JobRequest(db);
    job = new Job(db);
    user = new User(db);

    workerId = await user.create("worker@example.com", "worker@example.com");
    employeeId = await user.create(
      "employee@example.com",
      "employee@example.com"
    );

    jobId = await job.create("test", 12, "test", "test", 12, 12, employeeId);
  });

  beforeEach(async () => {
    await jobProposal.dbQueryAsync("DELETE FROM job_requests");
  });

  after(async () => {
    await jobProposal.dbQueryAsync("DELETE FROM job_requests");
    await user.dbQueryAsync("DELETE FROM jobs");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new job proposal and return the insertId", async () => {
      const proposal = await jobProposal.create(jobId, workerId, 50, 12);
      expect(proposal.id).to.be.a("number");
    });
  });

  describe("getById", () => {
    it("should return the job proposal by ID", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const proposal = await jobProposal.getById(proposalId);
      expect(proposal).to.be.an("object");
      expect(proposal.id).to.equal(proposalId);
    });

    it("should return null if the proposal does not exist", async () => {
      const proposalId = -1;
      const proposal = await jobProposal.getById(proposalId);
      expect(proposal).to.be.null;
    });
  });

  describe("changeStatus", () => {
    it("should change the status of the job proposal", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;

      const status = jobProposal.statuses.inProgress;
      const updatedProposal = await jobProposal.changeStatus(
        proposalId,
        status
      );
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(status);
    });
  });

  describe("accept", () => {
    it("should change the status of the job proposal to 'In Progress'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.accept(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(jobProposal.statuses.inProgress);
    });
  });

  describe("reject", () => {
    it("should change the status of the job proposal to 'Rejected'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.reject(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(jobProposal.statuses.rejected);
    });
  });

  describe("requestToCancel", () => {
    it("should change the status of the job proposal to 'Awaiting Cancellation Confirmation'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.requestToCancel(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(
        jobProposal.statuses.awaitingCancellationConfirmation
      );
    });
  });

  describe("acceptCancelled", () => {
    it("should change the status of the job proposal to 'Cancelled'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.acceptCancelled(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(jobProposal.statuses.cancelled);
    });
  });

  describe("requestToComplete", () => {
    it("should change the status of the job proposal to 'Awaiting Execution Confirmation'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.requestToComplete(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(
        jobProposal.statuses.awaitingExecutionConfirmation
      );
    });
  });

  describe("acceptCompleted", () => {
    it("should change the status of the job proposal to 'Completed'", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const updatedProposal = await jobProposal.acceptCompleted(proposalId);
      expect(updatedProposal).to.be.an("object");
      expect(updatedProposal.status).to.equal(jobProposal.statuses.completed);
    });
  });

  describe("exists", () => {
    it("should return true if the proposal exists", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const result = await jobProposal.exists(proposalId);
      expect(result).to.be.equal(1);
    });

    it("should return false if the proposal does not exist", async () => {
      const proposalId = -1;
      const result = await jobProposal.exists(proposalId);
      expect(result).to.be.equal(0);
    });
  });

  describe("checkJobHasProposals", () => {
    it("should return the count of proposals for a job", async () => {
      const count = await jobProposal.checkJobHasProposals(jobId);
      expect(count).to.be.a("number");
    });
  });

  describe("checkOwner", () => {
    it("should return true if the user is the owner of the proposal", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;
      const result = await jobProposal.checkOwner(proposalId, workerId);
      expect(result).to.be.equal(1);
    });

    it("should return false if the user is not the owner of the proposal", async () => {
      const proposalCreated = await jobProposal.create(jobId, workerId, 50, 12);
      const proposalId = proposalCreated.id;

      const result = await jobProposal.checkOwner(proposalId, employeeId);
      expect(result).to.be.equal(0);
    });
  });

  describe("groupedCountNewProposalsByDuration", () => {
    it("should return grouped count of new proposals by duration", async () => {
      const type = "between-dates";
      const params = { startDate: "2024-01-01", endDate: "2024-01-07" };
      const result = await jobProposal.groupedCountNewProposalsByDuration(
        type,
        params
      );
      expect(result).to.be.an("array");
    });
  });

  describe("groupedCountFinishedProposalsByDuration", () => {
    it("should return grouped count of finished proposals by duration", async () => {
      const type = "between-dates";
      const params = { startDate: "2024-01-01", endDate: "2024-01-07" };
      const result = await jobProposal.groupedCountFinishedProposalsByDuration(
        type,
        params
      );
      expect(result).to.be.an("array");
    });
  });

  describe("groupedCountRejectedProposalsByDuration", () => {
    it("should return grouped count of rejected proposals by duration", async () => {
      const type = "between-dates";
      const params = { startDate: "2024-01-01", endDate: "2024-01-07" };
      const result = await jobProposal.groupedCountRejectedProposalsByDuration(
        type,
        params
      );
      expect(result).to.be.an("array");
    });
  });

  describe("groupedCountCancelledProposalsByDuration", () => {
    it("should return grouped count of cancelled proposals by duration", async () => {
      const type = "between-dates";
      const params = { startDate: "2024-01-01", endDate: "2024-01-07" };
      const result = await jobProposal.groupedCountCancelledProposalsByDuration(
        type,
        params
      );
      expect(result).to.be.an("array");
    });
  });
});
