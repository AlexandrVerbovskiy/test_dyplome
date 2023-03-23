require("dotenv").config()
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {

    constructor(db) {
        this.db = db;
    }

    async registration(email, password, callback) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = {
                email,
                password: hashedPassword
            };
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
            });
        } catch (err) {
            console.error(err);
            return callback(500, {
                error: "Internal server error"
            })
        }
    }

    async login(email, password, callback) {
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

                    const token = jwt.sign({
                        userId: user.id
                    }, process.env.SECRET_KEY);
                    return callback(200, {
                        token
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
}

module.exports = User;