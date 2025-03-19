const notiService = require("../services/notificationService");
const ApiError = require("../responses/apiError");
const ApiSuccess = require("../responses/apiSuccess");

class NotificationController {
    async sendToken(req, res) {
        try {
            const { token, userId } = req.body;
            const result = await notiService.sendToken(token, userId);
            console.log("NotificationController " + result);
            return new ApiSuccess(200, "Token đã được lưu").send(res);
        } catch (error) {
            return new ApiError(error.statusCode || 500, error.message, error.errors).send(res);
        }
    }
}

module.exports = new NotificationController();
