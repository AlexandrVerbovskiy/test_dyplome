require("dotenv").config()
const {
    validateToken
} = require('../utils');
const {
    User: UserModel
} = require("../models");

class User {
    constructor(db) {
        this.userModel = new UserModel(db);
    }

    registration = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => res.status(code).json(data);
        await this.userModel.create(email, password, callback);
    }

    login = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => {
            if (data["token"]) res.set('Authorization', `Bearer ${data["token"]}`);
            res.status(code).json({
                ...data
            });
        }
        await this.userModel.findByPasswordAndEmail(email, password, callback);
    }

    validateToken = async (req, res) => {
        const {
            token
        } = req.body;

        const resValidate = await validateToken(token);
        if (resValidate) return res.status(200).json({
            validated: true
        });
        return res.status(200).json({
            validated: false
        });
    }
}

module.exports = User;