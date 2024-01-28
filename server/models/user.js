require("dotenv").config();
const bcrypt = require("bcrypt");
const Model = require("./model");

class User extends Model {
  __visibleFields = "id, email, address, lat, lng, nick, avatar, admin";

  create = async (email, password) =>
    await this.errorWrapper(async () => {
      const hashedPassword = await bcrypt.hash(
        password,
        this.passwordCashSaltOrRounds
      );
      const user = {
        email,
        password: hashedPassword,
        admin: 0,
      };

      const countUserRes = await this.dbQueryAsync(
        "SELECT COUNT(*) as count from users where email = ?",
        user.email
      );
      const count = countUserRes[0]["count"];
      if (count) this.setError("Email was registered earlier", 409);
      await this.dbQueryAsync("INSERT INTO users SET ?", user);
    });

  findByPasswordAndEmail = async (email, password) =>
    await this.errorWrapper(async () => {
      const authError = () => this.setError("Invalid email or password", 401);

      const findUserRes = await this.dbQueryAsync(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      if (!findUserRes.length) authError();

      const user = findUserRes[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) authError();

      const res = {
        id: user.id,
        email: user.email,
        address: user.address,
        lat: user.lat,
        lng: user.lng,
        nick: user.nick,
        avatar: user.avatar,
        admin: user.admin,
      };

      return res;
    });

  __baseGetUserInfo = async (select, userId) =>
    await this.errorWrapper(async () => {
      const findUserRes = await this.dbQueryAsync(
        `SELECT ${select} WHERE id = ?`,
        [userId]
      );
      return findUserRes[0];
    });

  getUserInfo = (userId) =>
    this.__baseGetUserInfo(`${this.__visibleFields} FROM users `, userId);

  checkIsAdmin = async (userId) =>
    await this.errorWrapper(async () => {
      const findUserRes = await this.dbQueryAsync(
        "SELECT admin FROM users WHERE id = ?",
        [userId]
      );
      const user = findUserRes[0];
      return user && user["admin"];
    });

  updateUserProfile = async (userId, profileData) =>
    await this.errorWrapper(async () => {
      const { nick, address, avatar, lat, lng } = profileData;

      await this.dbQueryAsync(
        "UPDATE users SET nick = ?, `address` = ?, avatar = ?, lat = ?, lng = ?, profile_authorized = ? WHERE id = ?",
        [nick, address, avatar, lat, lng, true, userId]
      );
    });

  updatePassword = async (accountId, password) =>
    await this.errorWrapper(async () => {
      const hashedPassword = await bcrypt.hash(
        password,
        this.passwordCashSaltOrRounds
      );
      await this.dbQueryAsync("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        accountId,
      ]);
    });

  getAdminsToGroup = async (lastId = 0, ignoreIds = [], filter = "") =>
    await this.errorWrapper(async () => {
      const params = [];
      let query =
        "SELECT nick, email, id, avatar FROM users WHERE admin = true";

      if (lastId && lastId > 0) {
        query += " AND id > ?";
        params.push(lastId);
      }

      if (ignoreIds.length > 0) {
        query += " AND id NOT IN (?)";
        params.push(ignoreIds);
      }

      if (filter.length > 0) {
        query += " AND (nick like ? OR email like ?)";
        params.push(`%${filter}%`, `%${filter}%`);
      }

      query += " ORDER BY id";

      return await this.dbQueryAsync(query, params);
    });

  getAdminsToGroupToJoin = async (
    chatId,
    lastId = 0,
    ignoreIds = [chatId],
    filter = ""
  ) =>
    await this.errorWrapper(async () => {
      const params = [chatId];

      let query = `SELECT nick, email, id, avatar FROM users WHERE admin = true AND id NOT IN 
        (SELECT user_id FROM chats_users WHERE chat_id = ? AND delete_time IS NOT NULL)`;

      if (lastId && lastId > 0) {
        query += " AND id > ?";
        params.push(lastId);
      }

      if (ignoreIds.length > 0) {
        query += " AND id NOT IN (?)";
        params.push(ignoreIds);
      }

      if (filter.length > 0) {
        query += " AND (nick like ? OR email like ?)";
        params.push(`%${filter}%`, `%${filter}%`);
      }

      query += " ORDER BY id";

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = User;
