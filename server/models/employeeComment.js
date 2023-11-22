require("dotenv").config();
const BaseComment = require("./baseComment");

class EmployeeComment extends BaseComment {
  __table = "employee_comments";
  __entityId = "employee_id";
  __needCountReply = true;
  __commentType = "employee";
  __mustBeUniqueParent = true;

  create = async ({ senderId, employeeId, rating, description }) => {
    await this.checkUserCommented(senderId, employeeId);

    return await this.__create("sender_id, employee_id, rating, description", [
      senderId,
      employeeId,
      rating,
      description,
    ]);
  };
}

module.exports = EmployeeComment;
