require("dotenv").config()
const jwt = require("jsonwebtoken");

function validateToken(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        userId = decodedToken.userId;
        return userId;
    } catch (error) {
        return null;
    }
}

module.exports = validateToken;