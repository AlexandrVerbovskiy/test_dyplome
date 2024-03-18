const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { randomString, validateToken: validateTokenUtil } = require("../utils");

const Controller = require("./controller");

class User extends Controller {
  __folder = "files/avatars";

  registration = (req, res) =>
    this.errorWrapper(res, async () => {
      const { email, password } = req.body;

      const userId = await this.userModel.create(email, password);
      await this.chatModel.createSystemChat({ id: userId });
      return this.sendResponseSuccess(
        res,
        "User registered successfully",
        {},
        201
      );
    });

  login = (req, res) =>
    this.errorWrapper(res, async () => {
      const { email, password } = req.body;

      const user = await this.userModel.findByPasswordAndEmail(email, password);
      const userId = user.id;

      const token = jwt.sign(
        {
          userId,
        },
        process.env.SECRET_KEY
      );

      res.set("Authorization", `Bearer ${token}`);

      return this.sendResponseSuccess(
        res,
        "User authoried successfully",
        {
          userId,
        },
        200
      );
    });

  validateToken = (req, res) =>
    this.errorWrapper(res, async () => {
      const { token } = req.body;

      const userId = await validateTokenUtil(token);
      const user = await this.userModel.getUserInfo(userId);

      if (!userId || !user) {
        return this.sendResponseSuccess(
          res,
          "Token error",
          {
            validated: false,
          },
          200
        );
      }

      const updatedToken = jwt.sign(
        {
          userId,
        },
        process.env.SECRET_KEY
      );

      res.set("Authorization", `Bearer ${updatedToken}`);
      return this.sendResponseSuccess(
        res,
        "Token updated successfully",
        {
          validated: true,
          user,
        },
        200
      );
    });

  updateUserProfile = async (req, res) =>
    this.errorWrapper(res, async () => {
      const { email, nick, address, lat, lng } = req.body;
      const userId = req.userData.userId;
      const avatarFile = req.file;
      let avatar = req.body.avatar ? req.body.avatar : null;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!nick || !address || !lat || !lng || !email)
        return this.sendResponseValidationError(res, "All fields are required");

      if (nick.length < 3)
        return this.sendResponseValidationError(
          res,
          "Nick must be at least 3 characters long"
        );

      if (lat === null || lng === null || isNaN(lat) || isNaN(lng))
        return this.sendResponseValidationError(
          res,
          "Invalid latitude or longitude values"
        );

      if (address.length > 255)
        return this.sendResponseValidationError(
          res,
          "Address length must not exceed 255 characters"
        );

      if (!emailRegex.test(email))
        return this.sendResponseValidationError(
          res,
          "Invalid email format. Please enter an email in the format 'example@example.com'."
        );

      //avatar saving
      if (avatarFile) {
        const user = await this.userModel.getUserInfo(userId);
        const prevAvatarFile = user["avatar"];
        if (prevAvatarFile) fs.unlinkSync(prevAvatarFile);

        const randomName = randomString();
        const fileExtension = avatarFile.filename.split(".").pop();
        avatar = path.join(this.__folder, `${randomName}.${fileExtension}`);
        const filePath = path.join(this.__temp_folder, avatarFile.filename);

        if (!fs.existsSync(this.__folder)) {
          fs.mkdirSync(this.__folder, {
            recursive: true,
          });
        }

        fs.renameSync(filePath, avatar);
      }

      await this.userModel.updateUserProfile(userId, {
        nick,
        address,
        avatar,
        lat,
        lng,
      });
      return this.sendResponseSuccess(res, "User profile updated successfully");
    });

  resetPasswordRequest = (req, res) =>
    this.errorWrapper(res, async () => {
      const { email } = req.body;

      const user = await this.userModel.findByEmail(email);
      if (!user)
        return this.sendResponseNoFoundError(
          res,
          "No user with this email was found"
        );

      let resetLink = await this.passwordResetLinkModel.getLinkByAccountId(
        user.id
      );
      if (!resetLink) {
        const resetToken = randomString();
        resetLink = await this.passwordResetLinkModel.createLink(
          user.id,
          resetToken
        );
      }

      return this.sendResponseSuccess(
        res,
        "A password reset link has been sent to your email",
        {
          resetLink,
        }
      );
    });

  updateForgottenPassword = (req, res) =>
    this.errorWrapper(res, async () => {
      const { password } = req.body;
      const resetToken = req.query.token;

      const resetLink = await this.passwordResetLinkModel.getLinkByToken(
        resetToken
      );
      if (!resetLink)
        return this.sendResponseNoFoundError(
          res,
          "Invalid password reset token"
        );

      const accountId = resetLink.account_id;
      await this.userModel.updatePassword(accountId, password);
      await this.passwordResetLinkModel.deleteLink(resetLink.id);

      return this.sendResponseSuccess(res, "Password successfully updated");
    });

  resetPassword = (req, res) =>
    this.errorWrapper(res, async () => {
      const { currentPassword, newPassword } = req.body;
      const userId = req.userData.userId;

      const user = await this.userModel.findById(userId);
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid)
        return this.sendResponseError(
          res,
          "The current password is incorrect",
          401
        );

      await this.userModel.updatePassword(userId, newPassword);
      return this.sendResponseSuccess(res, "Password successfully reset");
    });

  __getUserById = async (userId) => await this.userModel.getUserInfo(userId);

  getUserById = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.body;
      const user = await this.__getUserById(userId);
      return this.sendResponseSuccess(
        res,
        "User profile was getted successfully",
        user
      );
    });

  getFullUserById = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.body;
      const user = await this.userModel.getFullUserInfo(userId);
      return this.sendResponseSuccess(
        res,
        "User was getted successfully",
        user
      );
    });

  getPersonalProfile = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const user = await this.userModel.getUserInfo(userId);
      return this.sendResponseSuccess(
        res,
        "Personal profile userId getted successfully",
        user
      );
    });

  getUserStatistic = (req, res) =>
    this.errorWrapper(res, async () => {
      const { userId } = req.params;
      const user = await this.__getUserById(userId);

      user["countJobs"] = await this.jobModel.getCountByAuthor(userId);
      user["countJobProposalsFor"] =
        await this.jobProposalModel.getCountAllForUser(userId);
      user["countJobProposalsFrom"] =
        await this.jobProposalModel.getCountAllFromUser(userId);

      user["sendedDisputes"] = await this.disputeModel.getCountWhereUserSended(
        userId
      );

      user["accusedDisputes"] =
        await this.disputeModel.getCountWhereUserAccused(userId);

      user["allAcceptedForUser"] =
        await this.jobProposalModel.getCountAllAcceptedForUser(userId);
      user["allAcceptedFromUser"] =
        await this.jobProposalModel.getCountAllAcceptedFromUser(userId);

      user["allCompletedForUser"] =
        await this.jobProposalModel.getAllCompletedForUser(userId);
      user["allCompletedFromUser"] =
        await this.jobProposalModel.getAllCompletedFromUser(userId);

      user["allRejectedForUser"] =
        await this.jobProposalModel.getCountAllRejectedForUser(userId);
      user["allRejectedFromUser"] =
        await this.jobProposalModel.getCountAllRejectedFromUser(userId);

      user["allRejectedForUser"] =
        await this.jobProposalModel.getCountAllRejectedForUser(userId);
      user["allRejectedFromUser"] =
        await this.jobProposalModel.getCountAllRejectedFromUser(userId);

      user["allCancelledForUser"] =
        await this.jobProposalModel.getCountAllCancelledForUser(userId);
      user["allCancelledFromUser"] =
        await this.jobProposalModel.getCountAllCancelledFromUser(userId);

      return this.sendResponseSuccess(res, "User getted success", user);
    });

  getPersonalNotifications = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const count = req.body.count ?? 20;
      const lastId = req.body.lastId ?? 0;

      const notifications = await this.notificationModel.getUserNotifications(
        userId,
        lastId,
        count
      );

      return this.sendResponseSuccess(res, "User notifications got success", {
        notifications,
      });
    });

  getAdminsToGroup = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const lastId = req.body.lastId ?? 0;
      const ignoreIds = req.body.ignoreIds ?? [];
      const filter = req.body.filter ?? "";

      const admins = await this.userModel.getAdminsToGroup(
        lastId,
        [...ignoreIds, userId],
        filter
      );

      return this.sendResponseSuccess(res, "User notifications got success", {
        users: [...admins],
      });
    });

  getAdminsToGroupToJoin = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.userData.userId;
      const chatId = req.body.chatId;
      const lastId = req.body.lastId ?? 0;
      const ignoreIds = req.body.ignoreIds ?? [];
      const filter = req.body.filter ?? "";

      const admins = await this.userModel.getAdminsToGroupToJoin(
        chatId,
        lastId,
        [...ignoreIds, userId],
        filter
      );

      return this.sendResponseSuccess(res, "User notifications got success", {
        users: [...admins],
      });
    });

  getFullUsers = (req, res) =>
    this.errorWrapper(res, async () => {
      const { options, countItems } = await this.baseList(req, (params) =>
        this.userModel.count(params)
      );

      const users = await this.userModel.list(options);

      this.sendResponseSuccess(res, "User list got success", {
        users,
        options,
        countItems,
      });
    });

  changeUserRole = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.body.userId;
      const admin = await this.userModel.changeRole(userId);
      this.sendResponseSuccess(res, "Updated successfully", {
        admin,
      });
    });

  changeUserAuthorized = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.body.userId;
      const authorized = await this.userModel.changeAuthorized(userId);
      this.sendResponseSuccess(res, "Updated successfully", {
        authorized,
      });
    });

  deleteUser = (req, res) =>
    this.errorWrapper(res, async () => {
      const userId = req.body.userId;
      const admin = await this.userModel.delete(userId);
      this.sendResponseSuccess(res, "Deleted successfully");
    });
}

module.exports = User;
