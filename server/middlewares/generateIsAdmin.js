const { User: UserModel } = require("../models");

function generateIsAdmin(db) {
  return async function isAdmin(request, response, next) {
    try {
      const userModel = new UserModel(db);
      const userId = request.userData.userId;
      const isAdmin = await userModel.checkIsAdmin(userId);

      if (!isAdmin)
        return response.status(403).json({ message: "Access denied" });
      next();
    } catch (error) {
      console.error("admin middleware", error);
      response.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = generateIsAdmin;
