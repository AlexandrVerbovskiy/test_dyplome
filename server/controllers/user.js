const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const {
    promisify
} = require('util');
const {
    randomString,
    validateToken: validateTokenUtil
} = require('../utils');

const Controller = require("./controller");

class User extends Controller {
    registration = (req, res) => this.errorWrapper(res, async () => {
        const {
            email,
            password
        } = req.body;

        await this.userModel.create(email, password);
        this.setResponse({
            message: "User registered successfully"
        }, 201);
    });

    login = (req, res) => this.errorWrapper(res, async () => {
        const {
            email,
            password
        } = req.body;

        const userId = await this.userModel.findByPasswordAndEmail(email, password);
        const token = jwt.sign({
            userId
        }, process.env.SECRET_KEY);
        res.set('Authorization', `Bearer ${token}`);
        this.setResponse({
            userId
        }, 200);
    });

    validateToken = (req, res) => this.errorWrapper(res, async () => {
        const {
            token
        } = req.body;

        const userId = await validateTokenUtil(token);
        this.setResponse({
            validated: false
        }, 200);

        if (!userId) return;

        const updatedToken = jwt.sign({
            userId
        }, process.env.SECRET_KEY);

        res.set('Authorization', `Bearer ${updatedToken}`);
        this.setResponse({
            validated: true,
            userId
        }, 200);
    });

    updateUserProfile = (req, res) => this.errorWrapper(res, async () => {
        const {
            nick,
            address,
            lat,
            lng
        } = req.body;
        const userId = req.userData.userId;
        const avatarFile = req.files && req.files.image;

        if (!nick || !address || !lat || !lng) return this.setResponseValidationError("All fields are required");
        if (nick.length < 3) return this.setResponseValidationError("Nick must be at least 3 characters long");
        if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return this.setResponseValidationError("Invalid latitude or longitude values");
        if (address.length > 255) return this.setResponseValidationError("Address length must not exceed 255 characters");

        //avatar saving
        if (avatarFile) {
            const randomName = randomString();
            const fileExtension = avatarFile.name.split('.').pop();
            const avatar = path.join(__dirname, 'files', 'avatars', `${randomName}.${fileExtension}`);
            const avatarFileMove = promisify(avatarFile.mv);
            await avatarFileMove(avatar);
        }

        await this.userModel.updateUserProfile(userId, {
            nick,
            address,
            avatar,
            lat,
            lng
        });
        this.setResponseBaseSuccess('User profile updated successfully');
    });

    resetPasswordRequest = (req, res) => this.errorWrapper(res, async () => {
        const {
            email
        } = req.body;

        const user = await this.userModel.findByEmail(email);
        if (!user) return this.setResponseNoFoundError('No user with this email was found');

        let resetLink = await this.passwordResetLinkModel.getLinkByAccountId(user.id);
        if (!resetLink) {
            const resetToken = randomString();
            resetLink = await this.passwordResetLinkModel.createLink(user.id, resetToken);
        }

        this.setResponseBaseSuccess('A password reset link has been sent to your email', {
            resetLink
        });
    });

    updateForgottenPassword = (req, res) => this.errorWrapper(res, async () => {
        const {
            password
        } = req.body;
        const resetToken = req.query.token;

        const resetLink = await this.passwordResetLinkModel.getLinkByToken(resetToken);
        if (!resetLink) return this.setResponseNoFoundError('Invalid password reset token');

        const accountId = resetLink.account_id;
        await this.userModel.updatePassword(accountId, password);
        await this.passwordResetLinkModel.deleteLink(resetLink.id);

        this.setResponseBaseSuccess('Password successfully updated');
    });

    resetPassword = (req, res) => this.errorWrapper(res, async () => {
        const {
            currentPassword,
            newPassword
        } = req.body;
        const userId = req.userData.userId;

        const user = await this.userModel.findById(userId);
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) return this.setResponse({
            message: 'The current password is incorrect'
        }, 401);

        await this.userModel.updatePassword(userId, newPassword);
        this.setResponseBaseSuccess('Password successfully reset');
    });
}

module.exports = User;