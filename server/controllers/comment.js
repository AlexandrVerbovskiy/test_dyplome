const Controller = require("./controller");

class Comment extends Controller {
  create = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";

      let commentId = null;
      const description = req.body.description;
      const userId = req.userData.userId;

      if (commentType == "employee") {
        const employeeId = req.body.employeeId;
        const rating = req.body.rating;

        commentId = await this.employeeCommentModel.create({
          senderId: userId,
          employeeId,
          rating,
          description,
        });
      } else if (commentType == "worker") {
        const workerId = req.body.workerId;
        const rating = req.body.rating;

        commentId = await this.workerCommentModel.create({
          senderId: userId,
          workerId,
          rating,
          description,
        });
      } else if (commentType == "job") {
        const jobId = req.body.jobId;

        commentId = await this.jobCommentModel.create({
          senderId: userId,
          jobId,
          description,
        });
      } else {
        const parentId = req.body.parentId;
        const parentType = req.body.parentType;

        commentId = await this.replyCommentModel.create({
          senderId: userId,
          parentId,
          parentType,
          description,
        });
      }

      this.setResponseBaseSuccess("Comment sended success", {
        commentId,
      });
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
      const commentType = req.params.status ?? "reply";
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
      const commentType = req.params.status ?? "reply";
      const parentId = req.body.parentId;
      const lastId = req.body.lastId ?? 0;
      const limit = req.body.limit ?? 25;

      let getComments = this.replyCommentModel.getAllByEntityId;

      if (commentType == "employee") {
        getComments = this.employeeCommentModel.getAllByEntityId;
      } else if (commentType == "worker") {
        getComments = this.workerCommentModel.getAllByEntityId;
      } else if (commentType == "job") {
        getComments = this.jobCommentModel.getAllByEntityId;
      }

      const comments = await this.replyCommentModel.getComments(
        parentId,
        lastId,
        limit
      );

      this.setResponseBaseSuccess("Comments got success", {
        comments,
      });
    });
}

module.exports = Comment;
