require("dotenv").config();
const BaseComment = require("./baseComment");

const tableName = "employee_comments";

class EmployeeComment extends BaseComment {
  __table = tableName;
  __entityId = "employee_id";
  __needCountReply = true;
  __commentType = "employee";
  __mustBeUniqueParent = true;
  __baseFieldSelect = `${tableName}.id as id, ${tableName}.sender_id as senderId, ${tableName}.employee_id as employeeId,
    ${tableName}.rating, ${tableName}.body, ${tableName}.created_at as createdAt`;

  create = async ({ senderId, employeeId, rating, body }) => {
    await this.checkUserCommented(senderId, employeeId);

    return await this.__create("sender_id, employee_id, rating, body", [
      senderId,
      employeeId,
      rating,
      body,
    ]);
  };
}

module.exports = EmployeeComment;
