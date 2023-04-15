require("dotenv").config()
const jwt = require("jsonwebtoken");

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
            if (data["userId"]) {
                const token = jwt.sign({
                    userId: data["userId"]
                }, process.env.SECRET_KEY);
                res.set('Authorization', `Bearer ${token}`);
            }
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
        if (resValidate) {
            const token = jwt.sign({
                userId: resValidate
            }, process.env.SECRET_KEY);
            res.set('Authorization', `Bearer ${token}`);
            return res.status(200).json({
                validated: true,
                token
            });
        }
        return res.status(200).json({
            validated: false
        });
    }
}

module.exports = User;