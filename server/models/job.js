require("dotenv").config();

class Job {
    constructor(db) {
        this.db = db;
    }

    createJob = async ({
            title,
            price,
            address,
            description,
            lat,
            lng
        },
        user_id,
        successCallback,
        errorCallback
    ) => {
        await this.db.query(
            "INSERT INTO jobs (title, price, `address`, `description`, lat, lng, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [title, price, address, description, lat, lng, user_id],
            (err, res) => {
                if (err) return errorCallback(err);
                successCallback(res.insertId);
            }
        );
    };

    updateJob = async ({
            id,
            title,
            price,
            address,
            description,
            lat,
            lng
        },
        successCallback,
        errorCallback
    ) => {
        await this.db.query(
            "UPDATE jobs SET title = ?, price = ?, `address` = ?, `description` = ?, lat = ?, lng = ? WHERE id = ?",
            [title, price, address, description, lat, lng, id],
            (err, res) => {
                if (err) return errorCallback(err);
                successCallback(res.affectedRows);
            }
        );
    };


    deleteJobById = async (id, successCallback, errorCallback) => {
        await this.db.query(
            "DELETE FROM jobs WHERE id = ?",
            [id],
            (err, res) => {
                if (err) return errorCallback(err);
                successCallback(res.affectedRows);
            }
        );
    };

    getJobById = async (id, successCallback, errorCallback) => {
        await this.db.query(
            "SELECT * FROM jobs WHERE id = ?",
            [id],
            (err, res) => {
                if (err) return errorCallback(err);
                if (res.length > 0) {
                    successCallback(res[0]);
                } else {
                    successCallback(null);
                }
            }
        );
    };

    checkJobExists = async (jobId) => {
        const query = 'SELECT id FROM jobs WHERE id = ?';
        const result = await this.db.query(query, [jobId]);
        return result.length > 0;
    }

    getJobsByDistance = async (latitude, longitude, distance, successCallback, errorCallback) => {
        const latitudeLongitudeToKilometers = 111.045;
        const degreesToRadians = 57.3;

        await this.db.query(
            "SELECT *, SQRT(POW(111.045 * (latitude - ?), 2) + POW(" + latitudeLongitudeToKilometers + " * (? - longitude) * COS(latitude / " + degreesToRadians + "), 2)) AS distanceFromCenter FROM jobs HAVING distanceFromCenter <= ? ORDER BY distanceFromCenter ASC",
            [latitude, longitude, distance],
            (error, result) => {
                if (error) return errorCallback(error);
                successCallback(result);
            }
        );
    };

    getJobsByAuthor = async (authorId, successCallback, errorCallback) => {
        await this.db.query(
            "SELECT * FROM jobs WHERE author_id = ?",
            [authorId],
            (error, result) => {
                if (error) return errorCallback(error);
                successCallback(result);
            }
        );
    };

    checkJobExistsAndOwner = async (jobId, userId) => {
        return new Promise((resolve, reject) => {
            this.db.query(
                'SELECT * FROM jobs WHERE id = ? AND (author_id = ? OR status = "Completed")',
                [jobId, userId],
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.length > 0);
                    }
                }
            );
        });
    };
}

module.exports = Job