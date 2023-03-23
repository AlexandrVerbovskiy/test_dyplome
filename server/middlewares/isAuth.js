require("dotenv").config()
const jwt = require("jsonwebtoken");

function isAuth(request, response, next) {
  const authorization = request.headers.authorization;
  console.log(authorization)
  if (!authorization) return response.status(401).json({
    message: 'Authentication failed'
  });

  const token = authorization.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    request.userData = {
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    response.status(401).json({
      message: 'Authentication failed'
    });
  }
}

module.exports = isAuth;