const Controller = require("./controller");

class Job extends Controller {
    __validateEdit = (title, price, description, lat, lng) => {
        if (!title || title.length <= 2) return this.setResponseValidationError('Title should be at least 3 characters long');
        if (!price || price <= 0) return this.setResponseValidationError('Price should be greater than zero');
        if (description.length < 80) return this.setResponseValidationError('Description should be at least 80 characters long');
        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) return this.setResponseValidationError('Latitude and longitude should be valid numbers');
        return false;
    }

    __create = (req, res) => this.errorWrapper(res, async () => {
        const {
            title,
            price,
            address,
            description,
            lat,
            lng
        } = req.body;

        const userId = req.userData.userId;
        const resValidation = this.__validateEdit(title, price, description, lat, lng);
        if (resValidation) return resValidation;

        const jobId = await this.jobModel.create(title, price, address, description, lat, lng, userId);
        this.setResponseBaseSuccess("The job was created successfully", {
            newId: jobId
        });
    });

    __edit = (req, res) => this.errorWrapper(res, async () => {
        const {
            jobId,
            title,
            price,
            address,
            description,
            lat,
            lng
        } = req.body;

        const resValidation = this.__validateEdit(title, price, description, lat, lng);
        if (resValidation) return resValidation;

        await this.jobModel.edit(jobId, title, price, address, description, lat, lng);
        this.setResponseBaseSuccess("The job was updated successfully");
    });

    edit = async (req, res) => {
        const jobId = req.body.jobId;
        if (!jobId) return this.__create(req, res);

        const job = await this.jobModel.getById(jobId);
        if (!job) return this.__create(req, res);

        return this.__edit(req, res);
    }

    getById = (req, res) => this.errorWrapper(res, async () => {
        const jobId = req.params.id;
        const job = await this.jobModel.getById(jobId);
        this.setResponseBaseSuccess("The job was updated successfully", job);
    })
}

module.exports = Job;