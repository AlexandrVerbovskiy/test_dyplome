require("dotenv").config()
const bcrypt = require("bcrypt");

class User {
    constructor(db) {
        this.db = db;
    }

    create = async (email, password, callback) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                email,
                password: hashedPassword
            };

            const localRegistration = async () => {
                await this.db.query("INSERT INTO users SET ?", user, (err, result) => {
                    if (err) {
                        console.error(err);
                        return callback(500, {
                            error: "Internal server error"
                        })
                    }
                    return callback(201, {
                        message: "User registered successfully"
                    })
                })
            }

            await this.db.query("SELECT COUNT(*) as count from users where email = ?", user.email, async (err, result) => {
                if (err || result.length < 1)
                    return callback(500, {
                        error: "Internal server error"
                    })

                if (result[0].count > 0)
                    return callback(409, {
                        error: "Email was registered earlier"
                    })

                await localRegistration();
            });
        } catch (err) {
            console.error(err);
            return callback(500, {
                error: "Internal server error"
            })
        }
    }

    findByPasswordAndEmail = async (email, password, callback) => {
        try {
            this.db.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                async (err, result) => {
                    if (err)
                        return callback(500, {
                            error: "Internal server error"
                        })

                    if (result.length == 0)
                        return callback(401, {
                            error: "Invalid email or password"
                        })


                    const user = result[0];
                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (!isPasswordValid)
                        return callback(401, {
                            error: "Invalid email or password"
                        })
                   
                    return callback(200, {
                        userId: user.id
                    })
                }
            );
        } catch (err) {
            console.error(err);
            return callback(500, {
                error: "Internal server error"
            })
        }
    }

    getUserInfo = async (userId, successCallback, errorCallback) => {
        await this.db.query('SELECT * FROM users WHERE id = ?', [userId], (err, res) => {
            if (err) return errorCallback(err);
            if (res.length > 0) return successCallback(res[0]);
            successCallback(null);
        })
    }
}

module.exports = User;