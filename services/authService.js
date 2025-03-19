const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../util/mail');

class AuthService {
    async register(userData) {
        try {
            const { name, email, password } = userData;

            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return { error: 'EMAIL_EXISTS' };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await User.create({
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            const token = this.generateToken(this.sanitizeUser(user));
            console.log("register Token:", token);
            await sendVerificationEmail(email, "http://localhost:3000/auth/verifyEmail?token=" + token.sessionToken);
            return { user: this.sanitizeUser(user) };
        } catch (error) {
            console.log("Error:", error);
            return "FAIL";
        }
    }

    async verifyEmail(token) {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
                if (error || !user.email) {
                    return { error: 'INVALID_OR_EXPIRED_TOKEN' };
                }
                const result = await User.updateOne(
                    { email: user.email },
                    { $set: { verified: true } }
                );

                console.log("Update Result:", result);

                return 'SUCCESS';
                // return result;
            });
        } catch (error) {
            console.log("Error:", error);
            return 'FAIL';
        }
    }


    async login(email, password) {
        try {
            if (!email || !password) {
                return { error: 'MISSING_FIELDS' };
            }

            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user) {
                return { error: 'INVALID_CREDENTIALS' };
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return { error: 'INVALID_CREDENTIALS' };
            }

            if (!user.verified) {
                return { error: 'ACCOUNT_UNVERIFIED' };
            }
            const token = this.generateToken(this.sanitizeUser(user));

            const result = await User.updateOne(
                { email: email.toLowerCase() },
                { $set: { sessionToken: token.sessionToken, refreshSessionToken: token.refreshSessionToken } }
            );

            return {
                user: this.sanitizeUser(user),
                token
            };
        } catch (error) {
            console.log("Error:", error);
            return "FAIL";

        }
    }

    generateToken(userData) {
        const sessionToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24 hours' });
        const refreshSessionToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15 days' });
        return { sessionToken: sessionToken, refreshSessionToken: refreshSessionToken };
    }

    sanitizeUser(user) {
        const { password, createdAt, updatedAt, sessionToken, refreshSessionToken, __v, ...sanitizedUser } = user.toObject();
        return sanitizedUser;
    }
}

module.exports = new AuthService();