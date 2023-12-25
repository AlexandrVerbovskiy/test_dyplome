const { validateToken } = require("../utils");

function generateIsAuth() {
  return function (request, response, next) {
    const authorization = request.headers.authorization;
    if (!authorization)
      return response.status(401).json({
        message: "Authentication failed",
      });

    const token = authorization.split(" ")[1];
    const userId = validateToken(token);

    if (!userId)
      return response.status(401).json({
        message: "Authentication failed",
      });

    request.userData = {
      userId,
    };
    return next();
  };
}

module.exports = generateIsAuth;
