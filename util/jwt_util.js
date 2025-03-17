const jwt = require("jsonwebtoken");

// Generate an access token and a refresh token for this database user
exports.jwtTokens = ({ id, user_name, user_email, user_age, user_height, user_weight, user_image }) => {
    const user = { id, user_name, user_email, user_age, user_height, user_weight, user_image };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24 hours' });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15 days' });
    return { accessToken, refreshToken };
};
//! fix