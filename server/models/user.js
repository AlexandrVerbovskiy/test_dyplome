require("dotenv").config();
const bcrypt = require("bcrypt");
const Model = require("./model");

class User extends Model {
  __visibleFields = "id, email, address, lat, lng, nick, avatar, admin";

  strFilterFields = ["email", "address", "nick"];

  orderFields = ["id", "email", "address", "nick"];

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
      const createUserRes = await this.dbQueryAsync(
        "INSERT INTO users SET ?",
        user
      );
      return createUserRes.insertId;
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

  getFullUserInfo = (userId) => this.__baseGetUserInfo(`* FROM users `, userId);

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
      const {
        nick,
        address,
        avatar,
        lat,
        lng,
        authorized,
        admin = null,
      } = profileData;

      let query =
        "UPDATE users SET nick = ?, `address` = ?, avatar = ?, lat = ?, lng = ?, profile_authorized = ?";
      const props = [nick, address, avatar, lat, lng, authorized];

      if (admin !== null) {
        query += ", admin = ?";
        props.push(admin);
      }

      query += " WHERE id = ?";
      props.push(userId);

      await this.dbQueryAsync(query, props);
    });

  createFull = async (profileData) =>
    await this.errorWrapper(async () => {
      const {
        nick,
        address,
        avatar,
        lat,
        lng,
        authorized,
        admin = null,
      } = profileData;

      const user = {
        email,
        nick,
        address,
        avatar,
        lat,
        lng,
        profile_authorized: authorized,
        admin,
        password: null,
      };

      const countUserRes = await this.dbQueryAsync(
        "SELECT COUNT(*) as count from users where email = ?",
        user.email
      );
      const count = countUserRes[0]["count"];
      if (count) this.setError("Email was registered earlier", 409);
      const createUserRes = await this.dbQueryAsync(
        "INSERT INTO users SET ?",
        user
      );
      return createUserRes.insertId;
    });

  changeAuthorized = async (userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        "UPDATE users SET profile_authorized = !profile_authorized WHERE id = ?",
        [userId]
      );

      const newRoleInfo = await this.dbQueryAsync(
        "SELECT profile_authorized FROM users WHERE id = ?",
        [userId]
      );

      return newRoleInfo[0]["profile_authorized"];
    });

  changeRole = async (userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("UPDATE users SET admin = !admin WHERE id = ?", [
        userId,
      ]);

      const newRoleInfo = await this.dbQueryAsync(
        "SELECT admin FROM users WHERE id = ?",
        [userId]
      );

      return newRoleInfo[0]["admin"];
    });

  delete = async (userId) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync("DELETE FROM users WHERE id = ?", [userId]);
    });

  updatePassword = async (accountId, password) =>
    await this.errorWrapper(async () => {
      const hashedPassword = await bcrypt.hash(
        password,
        this.passwordCashSaltOrRounds
      );
      const res = await this.dbQueryAsync(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, accountId]
      );
      return res;
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

  async getAdminsIds() {
    const res = await this.dbQueryAsync("SELECT id FROM users WHERE admin = 1");
    return res.map((row) => row.id);
  }

  getAdminsToGroupToJoin = async (
    chatId,
    lastId = 0,
    ignoreIds = [],
    filter = ""
  ) =>
    await this.errorWrapper(async () => {
      const params = [chatId];

      let query = `SELECT nick, email, id, avatar FROM users WHERE admin = true AND id NOT IN 
        (SELECT user_id FROM chats_users WHERE chat_id = ? AND delete_time IS NULL)`;

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

  updateOnline = async (userId, typing) => {
    await this.dbQueryAsync("UPDATE users SET online = ? WHERE id = ?", [
      typing,
      userId,
    ]);
  };

  baseGetMany = (props) => {
    const { filter } = props;
    const filterRes = this.baseStrFilter(filter);
    const baseQuery = `WHERE ${filterRes.conditions}`;
    const baseProps = filterRes.props;
    return { query: baseQuery, params: baseProps };
  };

  count = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      query = "SELECT COUNT(*) as count FROM users " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query = `SELECT * FROM users ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;
      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });
}

module.exports = User;
