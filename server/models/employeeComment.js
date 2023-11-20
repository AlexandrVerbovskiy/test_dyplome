require("dotenv").config();
const Comment = require("./comment");

class EmployeeComment extends Comment {
  __table = "employee_comments";
  __entityId = "employee_id";

  create = async ({ senderId, employeeId, rating, description }) =>
    this.__create("sender_id, employee_id, rating, description", [
      senderId,
      employeeId,
      rating,
      description,
    ]);
}

module.exports = EmployeeComment;
