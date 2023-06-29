require("dotenv").config()
const {
    User: UserModel,
    PasswordResetLink: PasswordResetLinkModel
} = require("../models");

class Controller {
    __actualResponseBody = {
        error: "Internal server error"
    };
    __actualResponseCode = 500;

    setResponseCode(code) {
        this.__actualResponseCode = code;
    }

    setResponseData(data) {
        const jsonData = JSON.stringify(data);
        const jsonDataParsed = JSON.parse(jsonData);
        this.__actualResponseBody = jsonDataParsed;
    }

    setResponse(data, code) {
        this.setResponseData(data);
        this.setResponseCode(code);
    }

    sendResponse(res) {
        res.status(this.__actualResponseCode).json(this.__actualResponseBody);
    }

    setResponseBaseSuccess(message, data = {}) {
        this.setResponseData({
            ...data,
            message
        });
        this.setResponseCode(200);
    }

    setResponseError(message, status) {
        this.setResponseData({
            error: message
        });
        this.setResponseCode(status);
    }

    setResponseValidationError = message => this.setResponseError(message, 400);
    setResponseNoFoundError = message => this.setResponseError(message, 404);

    constructor(db) {
        this.userModel = new UserModel(db);
        this.passwordResetLinkModel = new PasswordResetLinkModel(db);
    }

    async errorWrapper(res, func) {
        try {
            await func();
        } catch (e) {
            const status = e.status ? e.status : 500;
            const error = e.message
            console.log(e);
            this.setResponse({
                error
            }, status);
        } finally {
            this.sendResponse(res);
        }
    }
}

module.exports = Controller;