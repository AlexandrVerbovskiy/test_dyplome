require("dotenv").config();
const Model = require("./model");

class Job extends Model {
  __latitudeLongitudeToKilometers = 111.045;
  __degreesToRadians = 57.3;

  create = async (title, price, address, description, lat, lng, userId) =>
    await this.errorWrapper(async () => {
      const job = await this.dbQueryAsync(
        "INSERT INTO jobs (title, price, `address`, `description`, lat, lng, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [title, price, address, description, lat, lng, userId]
      );
      return job.insertId;
    });

  edit = async (jobId, title, price, address, description, lat, lng) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE jobs SET title = ?, price = ?, `address` = ?, `description` = ?, lat = ?, lng = ? WHERE id = ?",
        [title, price, address, description, lat, lng, jobId]
      );
    });

  delete = async (jobId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("DELETE FROM jobs WHERE id = ?", [jobId]);
    });

  getById = async (jobId) =>
    await this.errorWrapper(async () => {
      const jobs = await this.dbQueryAsync("SELECT * FROM jobs WHERE id = ?", [
        jobId,
      ]);
      if (jobs.length) return jobs[0];
      return null;
    });

  getByDistance = async (
    latitude,
    longitude,
    skippedIds = [],
    filter = "",
    limit = 20
  ) =>
    await this.errorWrapper(async () => {
      const generateDistanceRow = `SQRT(POW(${this.__latitudeLongitudeToKilometers} * (jobs.lat - ?), 2) + POW(${this.__latitudeLongitudeToKilometers} * (? - jobs.lng) * COS(jobs.lat / ${this.__degreesToRadians}), 2))`;
      let query = `SELECT jobs.*, nick as author, ${generateDistanceRow} AS distanceFromCenter FROM jobs
            join users on users.id = jobs.author_id`;
      const params = [latitude, longitude];

      const jobSkipIdsRequest = "jobs.id NOT IN (?)";
      const jobFilterRequest = `(jobs.title like "%${filter}%" OR nick like "%${filter}%")`;

      if (skippedIds.length > 0 && filter && filter.length > 0) {
        query += ` WHERE ${jobSkipIdsRequest} AND ${jobFilterRequest}`;
        params.push(skippedIds);
      } else {
        if (skippedIds.length > 0) {
          query += ` WHERE ${jobSkipIdsRequest}`;
          params.push(skippedIds);
        }

        if (filter && filter.length > 0) {
          query += ` WHERE ${jobFilterRequest}`;
        }
      }

      //HAVING distanceFromCenter <= ?
      query += ` ORDER BY distanceFromCenter ASC LIMIT ?`;
      params.push(limit);
      const jobs = await this.dbQueryAsync(query, params);
      return jobs;
    });

  getByAuthor = async (authorId) =>
    await this.errorWrapper(async () => {
      const jobs = await this.dbQueryAsync(
        "SELECT * FROM jobs WHERE author_id = ?",
        [authorId]
      );
      return jobs;
    });

  getCountByAuthor = async (authorId) =>
    await this.errorWrapper(async () => {
      const jobs = await this.dbQueryAsync(
        "SELECT * FROM jobs WHERE author_id = ?",
        [authorId]
      );
      return jobs.length;
    });

  exists = async (jobId) =>
    await this.errorWrapper(async () => {
      const jobs = await this.dbQueryAsync("SELECT id FROM jobs WHERE id = ?", [
        jobId,
      ]);
      return jobs.length;
    });

  checkAuthor = async (jobId, authorId) =>
    await this.errorWrapper(async () => {
      const jobs =
        ("SELECT * FROM jobs WHERE id = ? AND author_id = ?",
        [jobId, authorId]);
      return jobs.length;
    });
}
module.exports = Job;
