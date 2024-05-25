const chai = require("chai");
const expect = chai.expect;
const db = require("../setup");
const Job = require("../../models/job");
const User = require("../../models/user");

describe("Job Model with Real Database", () => {
  let jobModel;
  let user;
  let userId;

  before(async () => {
    jobModel = new Job(db);
    user = new User(db);
    userId = await user.create("worker@example.com", "worker@example.com");
  });

  beforeEach(async () => {
    await jobModel.dbQueryAsync("DELETE FROM jobs");
  });

  after(async () => {
    await jobModel.dbQueryAsync("DELETE FROM jobs");
    await user.dbQueryAsync("DELETE FROM users");
    db.end();
  });

  describe("create", () => {
    it("should insert a new job and return its id", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );

      expect(jobId).to.be.a("number");
    });
  });

  describe("edit", () => {
    it("should edit an existing job", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );

      const title = "Updated Test Job";
      const price = 200;
      const address = "Updated Test Address";
      const description = "Updated Test Description";
      const lat = 1;
      const lng = 1;

      await jobModel.edit(
        jobId,
        title,
        price,
        address,
        description,
        lat,
        lng,
        userId
      );

      const updatedJob = await jobModel.getById(jobId);
      expect(updatedJob).to.exist;
      expect(updatedJob.title).to.equal(title);
      expect(updatedJob.price).to.equal(price);
      expect(updatedJob.address).to.equal(address);
      expect(updatedJob.description).to.equal(description);
      expect(updatedJob.lat).to.equal(lat);
      expect(updatedJob.lng).to.equal(lng);
    });
  });

  describe("delete", () => {
    it("should delete an existing job", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      await jobModel.delete(jobId);
      const deletedJob = await jobModel.getById(jobId);
      expect(deletedJob).to.be.null;
    });
  });

  describe("getByDistance", () => {
    it("should return jobs within given distance from a point", async () => {
      const latitude = 0;
      const longitude = 0;
      const skippedIds = [];
      const filter = "";
      const limit = 10;

      const jobs = await jobModel.getByDistance(
        latitude,
        longitude,
        skippedIds,
        filter,
        limit
      );

      expect(jobs).to.be.an("array");
      expect(jobs).to.have.lengthOf.at.most(limit);
    });
  });

  describe("getCountByAuthor", () => {
    it("should return the count of jobs created by a specific author", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      const count = await jobModel.getCountByAuthor(userId);

      expect(count).to.be.a("number");
      expect(count).to.be.at.least(0);
    });
  });

  describe("exists", () => {
    it("should return true if a job exists with the given ID", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      const jobExists = await jobModel.exists(jobId);
      expect(jobExists).to.be.equal(1);
    });

    it("should return false if a job does not exist with the given ID", async () => {
      const jobId = -1;
      const jobExists = await jobModel.exists(jobId);
      expect(jobExists).to.be.equal(0);
    });
  });

  describe("checkAuthor", () => {
    it("should return true if the given user is the author of the job", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );

      const isAuthor = await jobModel.checkAuthor(jobId, userId);

      expect(isAuthor).to.be.equal(1);
    });

    it("should return false if the given user is not the author of the job", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      const authorId = 2;

      const isAuthor = await jobModel.checkAuthor(jobId, authorId);

      expect(isAuthor).to.be.equal(0);
    });
  });

  describe("baseGetMany", () => {
    it("should return query and parameters for filtering jobs based on provided parameters", () => {
      const props = {
        filter: "test",
      };

      const { query, params } = jobModel.baseGetMany(props);

      expect(query).to.be.a("string");
      expect(params).to.be.an("array");
    });
  });

  describe("count", () => {
    it("should return the count of jobs based on provided parameters", async () => {
      const props = {
        params: {
          filter: "test",
        },
      };

      const count = await jobModel.count(props);

      expect(count).to.be.a("number");
    });
  });

  describe("list", () => {
    it("should return a list of jobs based on provided parameters", async () => {
      const props = {
        filter: "test",
        orderType: "ASC",
        order: "id",
        start: 0,
        count: 10,
      };

      const jobs = await jobModel.list(props);

      expect(jobs).to.be.an("array");
    });
  });

  describe("getForAuthor", () => {
    it("should return a list of jobs for the given author based on provided parameters", async () => {
      await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );

      const skippedIds = [];
      const filter = "test";
      const limit = 10;

      const jobs = await jobModel.getForAuthor(
        userId,
        skippedIds,
        filter,
        limit
      );

      expect(jobs).to.be.an("array");
    });
  });

  describe("changeActivate", () => {
    it("should toggle the active status of the job with the given id", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      const newActiveStatus = await jobModel.changeActivate(jobId, userId);
      expect(newActiveStatus).to.be.a("number");
    });
  });

  describe("getById", () => {
    it("should return the job with the given id", async () => {
      const jobId = await jobModel.create(
        "Test Job",
        100,
        "Test Address",
        "Test Description",
        0,
        0,
        userId
      );
      const job = await jobModel.getById(jobId);
      expect(job).to.be.an("object");
    });

    it("should return null if job with the given id does not exist", async () => {
      const jobId = -1;
      const job = await jobModel.getById(jobId);
      expect(job).to.be.null;
    });
  });
});
