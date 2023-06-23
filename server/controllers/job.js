require("dotenv").config()
const fs = require('fs');

const {
    User: UserModel,
    Job: JobModel
} = require("../models");

class Job {
    constructor(db) {
        this.jobModel = new JobModel(db);
        this.userModel = new UserModel(db);
    }

    createJob = async (req, res) => {
        const {
            title,
            price,
            address,
            description,
            lat,
            lng
        } = req.body;
        const userId = req.userData.userId;

        if (!title || title.length <= 2) {
            return res.status(400).json({
                error: 'Title should be at least 3 characters long'
            });
        }

        if (!price || price <= 0) {
            return res.status(400).json({
                error: 'Price should be greater than zero'
            });
        }

        if (description.length < 80) {
            return res.status(400).json({
                error: 'Description should be at least 80 characters long'
            });
        }

        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            return res.status(400).json({
                error: 'Latitude and longitude should be valid numbers'
            });
        }

        const sendSuccess = (id) => {
            return res.status(200).json({
                newId: id
            });
        }

        const sendError = (err) => {
            return res.status(400).json({
                error: err
            });
        }

        await this.jobModel.findByPasswordAndEmail({
            title,
            price,
            address,
            description,
            lat,
            lng
        }, userId, sendSuccess, sendError);
    }

    updateJob = async (req, res) => {
        const {
            title,
            price,
            address,
            description,
            lat,
            lng
        } = req.body;
        const userId = req.userData.userId;

        if (!title || title.length <= 2) {
            return res.status(400).json({
                error: 'Title should be at least 3 characters long'
            });
        }

        if (!price || price <= 0) {
            return res.status(400).json({
                error: 'Price should be greater than zero'
            });
        }

        if (description.length < 80) {
            return res.status(400).json({
                error: 'Description should be at least 80 characters long'
            });
        }

        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
            return res.status(400).json({
                error: 'Latitude and longitude should be valid numbers'
            });
        }

        const sendSuccess = (id) => {
            return res.status(200).json({
                newId: id
            });
        }

        const sendError = (err) => {
            return res.status(400).json({
                error: err
            });
        }

        await this.jobModel.findByPasswordAndEmail({
            title,
            price,
            address,
            description,
            lat,
            lng
        }, userId, sendSuccess, sendError);
    }
}


module.exports = Job;