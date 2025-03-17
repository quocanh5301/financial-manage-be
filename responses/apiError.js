class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        if (errors) {
            this.errors = errors;
        }
        this.success = false;
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            errors: this.errors
        });
    }
}

module.exports = ApiError;