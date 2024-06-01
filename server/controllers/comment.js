const Controller = require("./controller");

class Comment extends Controller {
  create = async (req, res) =>
    this.errorWrapper(res, async () => {
      const commentType = req.params.type ?? "reply";
      let comment = null;
      const body = req.body.body;
      if (!body) return this.sendResponseError(res, "No comment body", 400);
      const userId = req.userData.userId;

      const user = await this.userModel.getFullUserInfo(userId);

      let notificationGetterId = null;
      let notificationRedirectUrl = null;

      if (commentType == "employee") {
        const employeeId = req.body.entityId;
        const rating = req.body.rating;

        if (!rating)
          return this.sendResponseError(res, "No comment rating", 400);
        if (!employeeId)
          return this.sendResponseError(res, "No comment employee", 400);

        comment = await this.employeeCommentModel.create({
          senderId: userId,
          employeeId,
          rating,
          body,
        });

        notificationGetterId = employeeId;
        notificationRedirectUrl = "/users/" + employeeId;
      } else if (commentType == "worker") {
        const workerId = req.body.entityId;
        const rating = req.body.rating;

        if (!rating)
          return this.sendResponseError(res, "No comment rating", 400);
        if (!workerId)
          return this.sendResponseError(res, "No comment worker", 400);

        comment = await this.workerCommentModel.create({
          senderId: userId,
          workerId,
          rating,
          body,
        });

        notificationGetterId = workerId;
        notificationRedirectUrl = "/users/" + workerId;
      } else if (commentType == "job") {
        const jobId = req.body.entityId;
        if (!jobId) return this.sendResponseError(res, "No comment job", 400);

        const job = await this.jobModel.getById(jobId);

        comment = await this.jobCommentModel.create({
          senderId: userId,
          jobId,
          body,
        });

        notificationGetterId = job.authorId;
        notificationRedirectUrl = "/job-view/" + jobId;
      } else {
        const entityId = req.body.entityId;
        const replyCommentType = req.body.parentType;
        const replyCommentId = req.body.replyCommentId;

        comment = await this.replyCommentModel.create({
          senderId: userId,
          parentId: entityId,
          parentType: replyCommentType,
          body,
          replyCommentId,
        });

        if (notificationGetterId != userId) {
          if (replyCommentType == "job") {
            const repliedComment = await this.jobCommentModel.getById(
              replyCommentId
            );

            notificationGetterId = repliedComment.senderId;
            notificationRedirectUrl = "/job-view/" + entityId;
          }

          if (replyCommentType == "employee") {
            const repliedComment = await this.employeeCommentModel.getById(
              replyCommentId
            );

            notificationGetterId = repliedComment.senderId;
            notificationRedirectUrl = "/users/" + entityId;
          }

          if (replyCommentType == "worker") {
            const repliedComment = await this.workerCommentModel.getById(
              replyCommentId
            );

            notificationGetterId = repliedComment.senderId;
            notificationRedirectUrl = "/users/" + entityId;
          }

          this.sentCommentNotification(
            {
              senderNick: user.nick,
              senderEmail: user.email,
              commentType: commentType,
              commentBody: body,
              redirectLink: notificationRedirectUrl,
            },
            notificationGetterId
          );
        }
      }

      return this.sendResponseSuccess(res, "Comment sended success", comment);
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
      return this.sendResponseSuccess(res, "Comment got success", {
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

      const comments = await getComments(lastId, limit);
      return this.sendResponseSuccess(res, "Comment got success", {
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
      } else if (commentType == "reply") {
        getComments = this.replyCommentModel.getAllByEntityId;
        getCountComments = this.replyCommentModel.getAllCountByEntityId;
      }

      const comments = await getComments(parentId, lastId, limit);

      const result = {
        comments,
      };

      if (needCount) {
        result["totalCount"] = await getCountComments();
      }

      return this.sendResponseSuccess(res, "Comments got success", result);
    });
}

module.exports = Comment;
