const Controller = require("./controller");

class Comment extends Controller {
  create = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";
      let comment = null;
      const body = req.body.body;
      if (!body) return this.setResponseError("No comment body", 400);
      const userId = req.userData.userId;

      if (commentType == "employee") {
        const employeeId = req.body.entityId;
        const rating = req.body.rating;

        if (!rating) return this.setResponseError("No comment rating", 400);
        if (!employeeId)
          return this.setResponseError("No comment employee", 400);

        comment = await this.employeeCommentModel.create({
          senderId: userId,
          employeeId,
          rating,
          body,
        });
      } else if (commentType == "worker") {
        const workerId = req.body.entityId;
        const rating = req.body.rating;

        if (!rating) return this.setResponseError("No comment rating", 400);
        if (!workerId) return this.setResponseError("No comment worker", 400);

        comment = await this.workerCommentModel.create({
          senderId: userId,
          workerId,
          rating,
          body,
        });
      } else if (commentType == "job") {
        const jobId = req.body.entityId;
        if (!jobId) return this.setResponseError("No comment job", 400);

        comment = await this.jobCommentModel.create({
          senderId: userId,
          jobId,
          body,
        });
      } else {
        const parentId = req.body.entityId;
        const parentType = req.body.parentType;

        comment = await this.replyCommentModel.create({
          senderId: userId,
          parentId,
          parentType,
          body,
        });
      }

      this.setResponseBaseSuccess("Comment sended success", comment);
    });

  getById = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";
      const commentId = req.body.id;

      let getById = this.replyCommentModel.getById;

      if (commentType == "employee") {
        getById = this.employeeCommentModel.getById;
      } else if (commentType == "worker") {
        getById = this.workerCommentModel.getById;
      } else if (commentType == "job") {
        getById = this.jobCommentModel.getById;
      }

      const comment = await getById(commentId);
      this.setResponseBaseSuccess("Comment got success", {
        comment,
      });
    });

  getAll = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";
      const lastId = req.body.lastId ?? 0;
      const limit = req.body.limit ?? 25;

      let getComments = this.replyCommentModel.getAll;

      if (commentType == "employee") {
        getComments = this.employeeCommentModel.getAll;
      } else if (commentType == "worker") {
        getComments = this.workerCommentModel.getAll;
      } else if (commentType == "job") {
        getComments = this.jobCommentModel.getAll;
      }

      const comments = await getById(lastId, limit);
      this.setResponseBaseSuccess("Comment got success", {
        comments,
      });
    });

  getAllByEntityId = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";
      const parentId = req.body.parentId;
      const lastId = req.body.lastId ?? 0;
      const limit = req.body.limit ?? 25;
      const needCount = req.body.needCount ?? false;

      let getComments = this.replyCommentModel.getAllByEntityId;
      let getCountComments = this.replyCommentModel.getAllCountByEntityId;

      if (commentType == "employee") {
        getComments = this.employeeCommentModel.getAllByEntityId;
        getCountComments = this.employeeCommentModel.getAllCountByEntityId;
      } else if (commentType == "worker") {
        getComments = this.workerCommentModel.getAllByEntityId;
        getCountComments = this.workerCommentModel.getAllCountByEntityId;
      } else if (commentType == "job") {
        getComments = this.jobCommentModel.getAllByEntityId;
        getCountComments = this.jobCommentModel.getAllCountByEntityId;
      }

      const comments = await getComments(parentId, lastId, limit);

      const res = {
        comments,
      };

      if (needCount) {
        res["totalCount"] =
          await getCountComments();
      }

      this.setResponseBaseSuccess("Comments got success", res);
    });
}

module.exports = Comment;
