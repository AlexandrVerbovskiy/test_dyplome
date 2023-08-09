require("dotenv").config()
const {
    User: UserModel,
    PasswordResetLink: PasswordResetLinkModel,
    Socket: SocketModel,
    Chat: ChatModel,
    Action: ActionModel,
    Job: JobModel,
    JobProposal: JobProposalModel,
    Dispute: DisputeModel
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
        this.socketModel = new SocketModel(db);
        this.chatModel = new ChatModel(db);
        this.actionModel = new ActionModel(db);
        this.jobModel = new JobModel(db);
        this.jobProposalModel = new JobProposalModel(db);
        this.disputeModel = new DisputeModel(db);

        /*
        models.forEach(model => {
            const modelObject = new model(db);
            const modelName = modelObject.constructor.name;
            const name = modelName.charAt(0).toLowerCase() + modelName.slice(1) + "Model";
            this[name] = modelObject;
        });
        */
    }

    async errorWrapper(res, func) {
        try {
            await func();
        } catch (e) {
            console.log(e)
            const status = e.status ? e.status : 500;
            const error = e.message
            this.setResponse({
                error
            }, status);
        } finally {
            this.sendResponse(res);
        }
    }
}

module.exports = Controller;