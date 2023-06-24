require("dotenv").config()

class PasswordResetLinkModel {
    constructor(db) {
        this.db = db;
    }

    async getLinkByAccountId(accountId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM password_reset_links WHERE account_id = ? LIMIT 1';
            this.db.query(query, [accountId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length > 0) {
                        resolve(result[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async createLink(accountId, resetToken) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO password_reset_links (account_id, reset_token) VALUES (?, ?)';
            this.db.query(query, [accountId, resetToken], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resetToken);
                }
            });
        });
    }

    async getLinkByToken(token) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM password_reset_links WHERE reset_token = ? LIMIT 1';
            this.db.query(query, [token], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length > 0) {
                        resolve(result[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async deleteLink(linkId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM password_reset_links WHERE id = ?';
            this.db.query(query, [linkId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = PasswordResetLinkModel;