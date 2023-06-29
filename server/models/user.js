require("dotenv").config()
const bcrypt = require("bcrypt");
const Model = require("./model");

class User extends Model {
    create = async (email, password) => await this.errorWrapper(async () => {
        const hashedPassword = await bcrypt.hash(password, this.passwordCashSaltOrRounds);
        const user = {
            email,
            password: hashedPassword
        };

        const countUserRes = await this.dbQueryAsync("SELECT COUNT(*) as count from users where email = ?", user.email);
        const count = countUserRes[0]['count'];
        if (count) this.setError("Email was registered earlier", 409);
        await this.dbQueryAsync("INSERT INTO users SET ?", user);
    });

    findByPasswordAndEmail = async (email, password) => await this.errorWrapper(async () => {
        const authError = () => this.setError("Invalid email or password", 401);

        const findUserRes = await this.dbQueryAsync("SELECT * FROM users WHERE email = ?", [email]);
        if (!findUserRes.length) authError();

        const user = findUserRes[0];
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) authError();
        return user.id;
    });

    getUserInfo = async (userId) => await this.errorWrapper(async () => {
        const findUserRes = await this.dbQueryAsync("SELECT * FROM users WHERE id = ?", [userId]);
        const user = findUserRes[0];
        return user;
    });

    updateUserProfile = async (userId, profileData) => await this.errorWrapper(async () => {
        const {
            nick,
            address,
            avatar,
            lat,
            lng
        } = profileData;

        await this.dbQueryAsync("UPDATE users SET nick = ?, `address` = ?, avatar = ?, lat = ?, lng = ?, profile_authorized = ? WHERE id = ?",
            [nick, address, avatar, lat, lng, true, userId]);
    });

    updatePassword = async (accountId, password) => await this.errorWrapper(async () => {
        const hashedPassword = await bcrypt.hash(password, this.passwordCashSaltOrRounds);
        await this.dbQueryAsync("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, accountId]);
    });
}

module.exports = User;