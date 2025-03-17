class ApiSuccess {
    constructor(statusCode, message, data = null) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        if (data) {
            this.data = data;
        }
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data
        });
    }
}

module.exports = ApiSuccess;