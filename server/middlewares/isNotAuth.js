require("dotenv").config()
const jwt = require("jsonwebtoken");

function isNotAuth(request, response, next) {
    const authorization = request.headers.authorization;
    if (!authorization) return next();
  
    const token = authorization.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      if(!decodedToken) return next();

      response.status(403).json({
        message: 'Forbidden'
      });
    } catch (error) {
      next();
    }
  }
  
  module.exports = isNotAuth;