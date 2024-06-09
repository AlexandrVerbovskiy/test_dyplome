const { validateToken } = require("../utils");

function generateIsNotAuth() {
  return function (request, response, next) {
    const authorization = request.headers.authorization;

    if (!authorization) return next();

    const token = authorization.split(" ")[1];
    const userId = validateToken(token);

    if (userId)
      return response.status(403).json({
        message: "Forbidden",
      });

    return next();
  };
}

module.exports = generateIsNotAuth;
