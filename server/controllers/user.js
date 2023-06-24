require("dotenv").config()
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const {
    randomString
} = require('../utils')

const {
    validateToken
} = require('../utils');
const {
    User: UserModel
} = require("../models");

class User {
    constructor(db) {
        this.userModel = new UserModel(db);
        this.passwordResetLinkModel = new PasswordResetLink(db);
    }

    registration = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => res.status(code).json(data);
        await this.userModel.create(email, password, callback);
    }

    login = async (req, res) => {
        const {
            email,
            password
        } = req.body;
        const callback = (code, data) => {
            if (data["userId"]) {
                const token = jwt.sign({
                    userId: data["userId"]
                }, process.env.SECRET_KEY);
                res.set('Authorization', `Bearer ${token}`);
            }
            res.status(code).json({
                ...data
            });
        }
        await this.userModel.findByPasswordAndEmail(email, password, callback);
    }

    validateToken = async (req, res) => {
        const {
            token
        } = req.body;

        const resValidate = await validateToken(token);
        if (resValidate) {
            const token = jwt.sign({
                userId: resValidate
            }, process.env.SECRET_KEY);
            res.set('Authorization', `Bearer ${token}`);
            return res.status(200).json({
                validated: true,
                userId: resValidate
            });
        }
        return res.status(200).json({
            validated: false
        });
    }

    updateUserProfile = (req, res) => {
        const {
            nick,
            address,
            lat,
            lng
        } = req.body;
        const userId = req.userData.userId;

        // Валідація даних
        if (!nick || !address || !lat || !lng) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        if (nick.length < 3) {
            return res.status(400).json({
                error: 'Nick must be at least 3 characters long'
            });
        }

        if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                error: 'Invalid latitude or longitude values'
            });
        }

        if (address.length > 255) {
            return res.status(400).json({
                error: 'Address length must not exceed 255 characters'
            });
        }

        if (avatarFile) {
            // Збереження аватару
            const randomName = randomString();
            const fileExtension = avatarFile.name.split('.').pop();
            const avatar = path.join(__dirname, 'files', 'avatars', `${randomName}.${fileExtension}`);

            avatarFile.mv(avatar, (err) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Failed to save avatar file'
                    });
                }
                this.userModel.updateUserProfile(
                    userId, {
                        nick,
                        address,
                        avatar,
                        lat,
                        lng
                    },
                    () => {
                        return res.status(200).json({
                            message: 'User profile updated successfully'
                        });
                    },
                    (err) => {
                        return res.status(500).json({
                            error: err
                        });
                    }
                );
                return;
            });
        } else {
            return res.status(400).json({
                error: 'Avatar is required'
            });
        }
    };

    async resetPasswordRequest(req, res) {
        const {
            email
        } = req.body;

        try {
            const user = await this.userModel.findByEmail(email);
            if (!user) {
                return res.status(404).json({
                    error: 'No user with this email was found'
                });
            }

            let resetLink = await this.passwordResetLinkModel.getLinkByAccountId(user.id);
            if (!resetLink) {
                const resetToken = randomString();
                resetLink = await this.passwordResetLinkModel.createLink(user.id, resetToken);
            }


            return res.status(200).json({
                message: 'A password reset link has been sent to your email',
                resetLink
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Server error'
            });
        }
    }

    async updateForgottenPassword(req, res) {
        const {
            password
        } = req.body;
        const resetToken = req.query.token;

        try {
            const resetLink = await this.passwordResetLinkModel.getLinkByToken(resetToken);
            if (!resetLink) {
                return res.status(404).json({
                    error: 'Invalid password reset token'
                });
            }

            const accountId = resetLink.account_id;
            await this.userModel.updatePassword(accountId, password);

            await this.passwordResetLinkModel.deleteLink(resetLink.id);

            return res.status(200).json({
                message: 'Password successfully updated'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Server error'
            });
        }
    }

    resetPassword = async (req, res) => {
        const {
            currentPassword,
            newPassword
        } = req.body;
        const userId = req.userData.userId;

        try {
            const user = await this.userModel.findById(userId);
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    message: 'The current password is incorrect'
                });
            }

            await this.userModel.updatePassword(userId, newPassword);

            return res.status(200).json({
                message: 'Password successfully reset'
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Server error'
            });
        }
    };
}

module.exports = User;