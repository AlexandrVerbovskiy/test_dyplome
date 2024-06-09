const Controller = require("./controller");

class Job extends Controller {
  __validateEdit = (res, title, price, description, lat, lng) => {
    if (!title || title.length < 2)
      return this.sendResponseValidationError(
        res,
        "Title should be at least 2 characters long"
      );
    if (!price || price <= 0)
      return this.sendResponseValidationError(
        res,
        "Price should be greater than zero"
      );
    if (description.length < 20)
      return this.sendResponseValidationError(
        res,
        "Description should be at least 20 characters long"
      );
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)))
      return this.sendResponseValidationError(
        res,
        "Latitude and longitude should be valid numbers"
      );
    return false;
  };

  __create = (req, res, currentUserOwner = true) =>
    this.errorWrapper(res, async () => {
      const { title, price, address, description, lat, lng } = req.body;
      let userId = req.body.userId;

      if (currentUserOwner) {
        userId = req.userData.userId;
      }

      const resValidation = this.__validateEdit(
        res,
        title,
        price,
        description,
        lat,
        lng
      );
      if (resValidation) return resValidation;

      const jobId = await this.jobModel.create(
        title,
        price,
        address,
        description,
        lat,
        lng,
        userId
      );
      return this.sendResponseSuccess(res, "The job was created successfully", {
        newId: jobId,
      });
    });

  __edit = (req, res, currentUserOwner = true) =>
    this.errorWrapper(res, async () => {
      const { jobId, title, price, address, description, lat, lng } = req.body;
      let userId = req.body.userId;

      if (currentUserOwner) {
        userId = req.userData.userId;
      }

      const resValidation = this.__validateEdit(
        res,
        title,
        price,
        description,
        lat,
        lng
      );
      if (resValidation) return resValidation;

      await this.jobModel.edit(
        jobId,
        title,
        price,
        address,
        description,
        lat,
        lng,
        userId
      );
      return this.sendResponseSuccess(res, "The job was get successfully");
    });

  edit = async (req, res) => {
    const jobId = req.body.jobId;
    if (!jobId) return this.__create(req, res);

    const job = await this.jobModel.getById(jobId);
    if (!job) return this.__create(req, res);

    return this.__edit(req, res);
  };

  editByAdmin = async (req, res) => {
    const jobId = req.body.jobId;
    if (!jobId) return this.__create(req, res, false);

    const job = await this.jobModel.getById(jobId);
    if (!job) return this.__create(req, res, false);

    return this.__edit(req, res, false);
  };

  getById = (req, res) =>
    this.errorWrapper(res, async () => {
      const jobId = req.params.id;
      const job = await this.jobModel.getById(jobId);
      return this.sendResponseSuccess(res, "The jobs were get successfully", {
        job,
      });
    });

  getByDistance = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const user = await this.userModel.getUserInfo(userId);
      const skippedIds = req.body.skippedIds ? req.body.skippedIds : [];
      const needCountJobs = req.body.count ? req.body.count : 20;
      const filter = req.body.filter ?? "";

      const lat = user.lat ? user.lat : 0;
      const lng = user.lng ? user.lng : 0;
      const jobs = await this.jobModel.getByDistance(
        lat,
        lng,
        skippedIds,
        filter,
        needCountJobs,
        [userId]
      );

      return this.sendResponseSuccess(res, "The job was get successfully", {
        jobs,
      });
    });

  getAllJobs = (req, res) =>
    this.errorWrapper(res, async () => {
      const { options, countItems } = await this.baseList(req, (params) =>
        this.jobModel.count({ params })
      );

      const jobs = await this.jobModel.list(options);

      this.sendResponseSuccess(res, "Job list got success", {
        jobs,
        options,
        countItems,
      });
    });

  getForAuthor = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const skippedIds = req.body.skippedIds ? req.body.skippedIds : [];
      const filter = req.body.filter ?? "";
      const needCountJobs = req.body.count ? req.body.count : 20;
      const jobs = await this.jobModel.getForAuthor(
        userId,
        skippedIds,
        filter,
        needCountJobs
      );
      return this.sendResponseSuccess(res, "Jobs was get successfully", {
        jobs,
      });
    });

  changeActivate = (req, res) =>
    this.errorWrapper(res, async () => {
      const jobId = req.body.id;
      const userId = req.userData.userId;

      const hasProposals = await this.jobProposalModel.checkJobHasProposals(
        jobId
      );

      /*if (hasProposals) {
        return this.sendResponseError(
          res,
          "The job has pending offers. You cannot hide it until you complete them."
        );
      }*/

      const active = await this.jobModel.changeActivate(jobId, userId);

      return this.sendResponseSuccess(
        res,
        "The job active was updated successfully",
        {
          active,
        }
      );
    });

  changeActivateByAdmin = (req, res) =>
    this.errorWrapper(res, async () => {
      const jobId = req.body.id;

      const hasProposals = await this.jobProposalModel.checkJobHasProposals(
        jobId
      );

      if (hasProposals) {
        return this.sendResponseError(
          res,
          "The job has pending offers. You cannot hide it until you complete them.",
          409
        );
      }

      const active = await this.jobModel.changeActivate(jobId);

      return this.sendResponseSuccess(
        res,
        "The job active was update successfully",
        {
          active,
        }
      );
    });
}

module.exports = Job;
