const { User: UserModel } = require("../models");
const generateIsAuth = require("./generateIsAuth");

function __generateIsAdmin(db) {
  return async function isAdmin(request, response, next) {
    try {
      const userModel = new UserModel(db);
      const userId = request.userData.userId;
      const isAdmin = await userModel.checkIsAdmin(userId);

      if (!isAdmin)
        return response.status(403).json({ message: "Access denied" });
      return next();
    } catch (error) {
      return response.status(500).json({ message: "Internal server error" });
    }
  };
}

function generateIsAuthAndAdmin(db) {
  const isAuth = generateIsAuth();
  const isAdmin = __generateIsAdmin(db);

  return function isAuthAndAdmin(request, response, next) {
    isAuth(request, response, () => isAdmin(request, response, next));
  };
}

module.exports = generateIsAuthAndAdmin;
