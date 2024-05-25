const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const Dispute = require("../../models/dispute");
const Job = require("../../models/job");
const JobRequest = require("../../models/jobProposal");
const User = require("../../models/user");

const description = "Test dispute description";

describe("Dispute Model", () => {
  let disputeModel;
  let jobModel;
  let jobRequestModel;
  let userModel;
  let jobId;
  let jobProposalId;
  let workerId;
  let employeeId;
  let adminId;

  before(async () => {
    disputeModel = new Dispute(db);
    jobModel = new Job(db);
    jobRequestModel = new JobRequest(db);
    userModel = new User(db);

    workerId = await userModel.create(
      "worker@example.com",
      "worker@example.com"
    );
    employeeId = await userModel.create(
      "employee@example.com",
      "employee@example.com"
    );

    adminId = await userModel.create("admin@example.com", "admin@example.com");

    jobId = await jobModel.create(
      "test",
      12,
      "test",
      "test",
      12,
      12,
      employeeId
    );

    const jobProposal = await jobRequestModel.create(jobId, workerId, 12, 12);
    jobProposalId = jobProposal.id;
  });

  beforeEach(async () => {
    await disputeModel.dbQueryAsync("DELETE FROM disputes");
  });

  after(async () => {
    await disputeModel.dbQueryAsync("DELETE FROM disputes");
    await jobRequestModel.dbQueryAsync("DELETE FROM job_requests");
    await jobModel.dbQueryAsync("DELETE FROM jobs");
    await userModel.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should create a new dispute and return the dispute object", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      expect(dispute).to.be.an("object");
      expect(dispute.id).to.be.a("number");
      expect(dispute.description).to.equal(description);
      expect(dispute.status).to.equal("Pending");
    });
  });

  describe("getById", () => {
    it("should get a dispute by its id", async () => {
      const createdDispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      const dispute = await disputeModel.getById(createdDispute.id);

      expect(dispute).to.be.an("object");
      expect(dispute.id).to.equal(createdDispute.id);
    });

    it("should return null if dispute with given id does not exist", async () => {
      const id = 9999;

      const dispute = await disputeModel.getById(id);

      expect(dispute).to.be.null;
    });
  });

  describe("getByProposalId", () => {
    it("should get a dispute by its job proposal id", async () => {
      await disputeModel.create(jobProposalId, workerId, description);

      const dispute = await disputeModel.getByProposalId(jobProposalId);

      expect(dispute).to.be.an("object");
      expect(dispute.jobRequestId).to.equal(jobProposalId);
    });

    it("should return null if dispute with given proposal id does not exist", async () => {
      const proposalId = 9999;

      const dispute = await disputeModel.getByProposalId(proposalId);

      expect(dispute).to.be.null;
    });
  });

  describe("getByJobId", () => {
    it("should get a dispute by its job id", async () => {
      await disputeModel.create(jobProposalId, workerId, description);

      const dispute = await disputeModel.getByJobId(jobId);

      expect(dispute).to.be.an("object");
      expect(dispute.jobRequestId).to.equal(jobId);
    });

    it("should return null if dispute with given job id does not exist", async () => {
      const jobId = 9999;

      const dispute = await disputeModel.getByJobId(jobId);

      expect(dispute).to.be.null;
    });
  });

  describe("setStatus", () => {
    it("should set the status of a dispute", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      const status = "Resolved";

      await disputeModel.setStatus(dispute.id, status);

      const updatedDispute = await disputeModel.getById(dispute.id);

      expect(updatedDispute).to.be.an("object");
      expect(updatedDispute.status).to.equal(status);
    });
  });

  describe("assignAdmin", () => {
    it("should assign an admin to the dispute", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      await disputeModel.assignAdmin(dispute.id, adminId);

      const updatedDispute = await disputeModel.getById(dispute.id);

      expect(updatedDispute).to.be.an("object");
      expect(updatedDispute.adminId).to.equal(adminId);
      expect(updatedDispute.status).to.equal("In Progress");
    });
  });

  describe("unassignAdmin", () => {
    it("should unassign an admin from the dispute", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );
      await disputeModel.assignAdmin(dispute.id, adminId);

      await disputeModel.unassignAdmin(dispute.id, adminId);

      const updatedDispute = await disputeModel.getById(dispute.id);

      expect(updatedDispute).to.be.an("object");
      expect(updatedDispute.adminId).to.be.null;
      expect(updatedDispute.status).to.equal("Pending");
    });
  });

  describe("checkProposalHasDispute", () => {
    it("should return true if proposal has a dispute", async () => {
      await disputeModel.create(jobProposalId, workerId, description);

      const hasDispute = await disputeModel.checkProposalHasDispute(
        jobProposalId
      );

      expect(hasDispute).to.be.true;
    });

    it("should return false if proposal does not have a dispute", async () => {
      const proposalId = 9999;

      const hasDispute = await disputeModel.checkProposalHasDispute(proposalId);

      expect(hasDispute).to.be.false;
    });
  });

  describe("workerRight", () => {
    it("should set worker's right for the dispute", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      await disputeModel.workerRight(dispute.id, workerId);

      const updatedDispute = await disputeModel.getById(dispute.id);

      expect(updatedDispute).to.be.an("object");
      expect(updatedDispute.rightUserId).to.equal(workerId);
      expect(updatedDispute.status).to.equal("Resolved");
    });
  });

  describe("employeeRight", () => {
    it("should set employee's right for the dispute", async () => {
      const dispute = await disputeModel.create(
        jobProposalId,
        workerId,
        description
      );

      await disputeModel.employeeRight(dispute.id, employeeId);

      const updatedDispute = await disputeModel.getById(dispute.id);

      expect(updatedDispute).to.be.an("object");
      expect(updatedDispute.rightUserId).to.equal(employeeId);
      expect(updatedDispute.status).to.equal("Resolved");
    });
  });

  describe("getAllPending", () => {
    it("should return all pending disputes", async () => {
      const pendingDisputes = await disputeModel.getAllPending();

      expect(pendingDisputes).to.be.an("array");
      expect(pendingDisputes.length).to.be.at.least(0);
    });
  });

  describe("getAllInProgress", () => {
    it("should return all disputes in progress", async () => {
      const inProgressDisputes = await disputeModel.getAllInProgress();

      expect(inProgressDisputes).to.be.an("array");
      expect(inProgressDisputes.length).to.be.at.least(0);
    });
  });

  describe("getAllResolved", () => {
    it("should return all resolved disputes", async () => {
      const resolvedDisputes = await disputeModel.getAllResolved();

      expect(resolvedDisputes).to.be.an("array");
      expect(resolvedDisputes.length).to.be.at.least(0);
    });
  });

  describe("getWhereUserSended", () => {
    it("should return all disputes where user is the sender", async () => {
      const userSendedDisputes = await disputeModel.getWhereUserSended(
        workerId
      );

      expect(userSendedDisputes).to.be.an("array");
      expect(userSendedDisputes.length).to.be.at.least(0);
    });
  });

  describe("getWhereUserAccused", () => {
    it("should return all disputes where user is accused", async () => {
      const userAccusedDisputes = await disputeModel.getWhereUserAccused(
        workerId
      );

      expect(userAccusedDisputes).to.be.an("array");
      expect(userAccusedDisputes.length).to.be.at.least(0);
    });
  });

  describe("getCountWhereUserSended", () => {
    it("should return count of disputes where user is the sender", async () => {
      const count = await disputeModel.getCountWhereUserSended(workerId);
      expect(count).to.be.a("number");
    });
  });

  describe("getCountWhereUserAccused", () => {
    it("should return count of disputes where user is accused", async () => {
      const count = await disputeModel.getCountWhereUserAccused(workerId);
      expect(count).to.be.a("number");
    });
  });

  describe("count", () => {
    it("should return count of disputes based on given parameters", async () => {
      const params = {
        filter: "test",
      };

      const count = await disputeModel.count({ params });

      expect(count).to.be.a("number");
    });
  });

  describe("list", () => {
    it("should return a list of disputes based on given parameters", async () => {
      await disputeModel.create(jobProposalId, workerId, description);

      const params = {
        filter: "test",
        orderType: "DESC",
        order: "created_at",
        start: 0,
        count: 10,
      };

      const disputes = await disputeModel.list(params);

      expect(disputes).to.be.an("array");
    });
  });

  describe("groupedCountNewDisputesByDuration", () => {
    it("should return grouped count of new disputes based on given duration", async () => {
      const type = "one-month";
      const params = {};

      const groupedCount = await disputeModel.groupedCountNewDisputesByDuration(
        type,
        params
      );

      expect(groupedCount).to.be.an("array");
    });
  });

  describe("groupedCountFinishedDisputesByDuration", () => {
    it("should return grouped count of finished disputes based on given duration", async () => {
      const type = "one-month";
      const params = {};

      const groupedCount =
        await disputeModel.groupedCountFinishedDisputesByDuration(type, params);

      expect(groupedCount).to.be.an("array");
    });
  });
});
