const Controller = require("./controller");

class Job extends Controller {
    __validateEdit = (title, price, description, lat, lng) => {
        if (!title || title.length <= 2) return this.setResponseValidationError('Title should be at least 3 characters long');
        if (!price || price <= 0) return this.setResponseValidationError('Price should be greater than zero');
        if (description.length < 80) return this.setResponseValidationError('Description should be at least 80 characters long');
        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) return this.setResponseValidationError('Latitude and longitude should be valid numbers');
        return false;
    }

    create = (req, res) => this.errorWrapper(res, async () => {
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

    edit = (req, res) => this.errorWrapper(res, async () => {
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

        await this.jobModel.edit(title, price, address, description, lat, lng, jobId);
        this.setResponseBaseSuccess("The job was updated successfully");
    });
}

module.exports = Job;