require("dotenv").config();
const bcrypt = require("bcrypt");
const Model = require("./model");
const generateRandomString = require("../utils/randomString");

class User extends Model {
  __visibleFields = `id, email, address, lat, lng, nick, avatar, admin, activity_radius as activityRadius, balance, phone,
    instagram_url as instagramUrl, linkedin_url as linkedinUrl, biography`;

  strFilterFields = ["email", "address", "nick"];

  orderFields = ["id", "email", "address", "nick"];

  __selectAllFields = `users.id, users.email, users.phone, users.nick, users.address, users.avatar, users.lat, users.lng, 
  users.activity_radius as activityRadius, users.profile_authorized as profileAuthorized, users.instagram_url as instagramUrl,
  users.linkedin_url as linkedinUrl, users.biography,
  users.online, users.admin, users.time_created as timeCreated, users.balance as balance`;

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
        biography: "",
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

  findByEmail = async (email) =>
    await this.errorWrapper(async () => {
      const findUserRes = await this.dbQueryAsync(
        `SELECT * FROM users WHERE email = ?`,
        [email]
      );

      return findUserRes[0];
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

  getFullUserInfo = (userId) =>
    this.__baseGetUserInfo(`${this.__selectAllFields} FROM users `, userId);

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
        email,
        nick,
        address,
        avatar,
        lat,
        lng,
        activityRadius,
        authorized,
        admin = null,
        balance = null,
        phone = null,
        biography = "",
        instagramUrl = "",
        linkedinUrl = "",
      } = profileData;

      const countUserRes = await this.dbQueryAsync(
        "SELECT COUNT(*) as count from users where email = ? AND id != ?",
        [email, userId]
      );
      const count = countUserRes[0]["count"];
      if (count) this.setError("Email was registered earlier", 409);

      let query =
        "UPDATE users SET activity_radius=?, nick = ?, email = ?, `address` = ?, avatar = ?, lat = ?, lng = ?, profile_authorized = ?, phone= ?, biography = ?, instagram_url = ?, linkedin_url = ?";
      const props = [
        activityRadius,
        nick,
        email,
        address,
        avatar,
        lat,
        lng,
        authorized,
        phone,
        biography,
        instagramUrl,
        linkedinUrl,
      ];

      if (admin !== null) {
        query += ", admin = ?";
        props.push(admin);
      }

      if (balance !== null) {
        query += ", balance = ?";
        props.push(balance);
      }

      query += " WHERE id = ?";
      props.push(userId);

      await this.dbQueryAsync(query, props);
    });

  createFull = async (profileData) =>
    await this.errorWrapper(async () => {
      const {
        email,
        nick,
        address,
        avatar,
        lat,
        lng,
        activityRadius,
        authorized,
        admin = null,
        balance = 0,
        phone = null,
        biography = "",
        instagramUrl = "",
        linkedinUrl = "",
      } = profileData;

      const user = {
        email,
        nick,
        address,
        avatar,
        lat,
        lng,
        profile_authorized: authorized,
        activity_radius: activityRadius,
        admin,
        password: null,
        balance,
        phone,
        biography,
        instagram_url: instagramUrl,
        linkedin_url: linkedinUrl,
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
        "SELECT profile_authorized as profileAuthorized FROM users WHERE id = ?",
        [userId]
      );

      return newRoleInfo[0]["profileAuthorized"];
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
    await this.dbQueryAsync(
      "UPDATE users SET online = ?, time_updated=CURRENT_TIMESTAMP WHERE id = ?",
      [typing, userId]
    );
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
      let { query, params } = this.baseGetMany(props.params);
      query = "SELECT COUNT(*) as count FROM users " + query;
      const res = await this.dbQueryAsync(query, params);
      return res[0]["count"];
    });

  list = async (props) =>
    await this.errorWrapper(async () => {
      let { query, params } = this.baseGetMany(props);
      const { orderType, order } = this.getOrderInfo(props);
      const { start, count } = props;

      query = `SELECT ${this.__selectAllFields} FROM users ${query} ORDER BY ${order} ${orderType} LIMIT ?, ?`;
      params.push(start, count);

      return await this.dbQueryAsync(query, params);
    });

  getNameIdList = async (start, count, filter) => {
    return await this.dbQueryAsync(
      `SELECT id as value, email as title FROM users WHERE email like ? LIMIT ?, ?`,
      [`%${filter}%`, start, count]
    );
  };

  generateResetPasswordTokenByEmail = async (email) =>
    await this.errorWrapper(async () => {
      const findUserRes = await this.dbQueryAsync(
        `SELECT reset_password_token as resetPasswordToken FROM users WHERE email = ?`,
        [email]
      );

      const user = findUserRes[0];

      if (!user) {
        return null;
      }

      if (user["resetPasswordToken"]) return user["resetPasswordToken"];

      const newToken = generateRandomString();
      await this.dbQueryAsync(
        `UPDATE users SET reset_password_token = ? WHERE email = ?`,
        [newToken, email]
      );
      return newToken;
    });

  setPasswordByEmailAndToken = async (email, token, password) =>
    await this.errorWrapper(async () => {
      const findUserRes = await this.dbQueryAsync(
        `SELECT ${this.__selectAllFields} FROM reset_password_token WHERE reset_password_token = ? AND email = ?`,
        [email, token]
      );

      if (!findUserRes) return false;

      const hashedPassword = await bcrypt.hash(
        password,
        this.passwordCashSaltOrRounds
      );

      await this.dbQueryAsync(
        `UPDATE users SET reset_password_token = null, password = ? WHERE reset_password_token = ?`,
        [hashedPassword, token]
      );

      if (!findUserRes) return true;
    });

  canRejectBalance = async (userId, value) =>
    await this.errorWrapper(async () => {
      const userInfo = await this.dbQueryAsync(
        `SELECT balance FROM users WHERE id = ?`,
        [userId]
      );

      const userBalance = userInfo[0]["balance"];
      const balanceDiff = Number(userBalance) - Number(value);

      return balanceDiff > 0;
    });

  addBalance = async (userId, value) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `UPDATE users SET balance = ROUND(balance + ?, 2) WHERE id = ?`,
        [value, userId]
      );

      const userInfo = await this.dbQueryAsync(
        `SELECT balance FROM users WHERE id = ?`,
        [userId]
      );

      const userBalance = userInfo[0]["balance"];
      return Number(userBalance);
    });

  rejectBalance = async (userId, value) =>
    await this.errorWrapper(async () => {
      await this.dbQueryAsync(
        `UPDATE users SET balance = ROUND(balance - ?, 2) WHERE id = ?`,
        [value, userId]
      );

      const userInfo = await this.dbQueryAsync(
        `SELECT balance FROM users WHERE id = ?`,
        [userId]
      );

      const userBalance = userInfo[0]["balance"];
      return Number(userBalance);
    });

  getActiveUsers = async () =>
    await this.errorWrapper(async () => {
      const users = await this.dbQueryAsync(
        `SELECT id FROM users WHERE online = ?`,
        [true]
      );

      return users.map((user) => user.id);
    });
}

module.exports = User;
