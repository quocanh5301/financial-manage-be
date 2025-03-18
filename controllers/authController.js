const authService = require("../services/authService");
const ApiError = require("../responses/apiError");
const ApiSuccess = require("../responses/apiSuccess");

class AuthController {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                throw new ApiError(400, 'Vui lòng điền đầy đủ thông tin đăng ký');
            }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                throw new ApiError(400, 'Email không đúng định dạng. Vui lòng nhập đúng định dạng email (ví dụ: example@domain.com)');
            }

            if (password.length < 6) {
                throw new ApiError(400, 'Mật khẩu phải có ít nhất 6 ký tự');
            }

            const result = await authService.register(req.body);

            if (result.error === 'EMAIL_EXISTS') {
                throw new ApiError(409, 'Email đã được sử dụng. Vui lòng sử dụng email khác.');
            }

            return new ApiSuccess(200, "Đăng ký tài khoản thành công, kiểm tra và xác nhận email của bạn", result.user).send(res);
        } catch (error) {
            return new ApiError(error.statusCode || 500, error.message, error.errors).send(res);
        }
    }

    async verifyEmail(req, res) {
        try {
            const token = req.query.token;
            const result = await authService.verifyEmail(token);

            if (result === 'INVALID_OR_EXPIRED_TOKEN') {
                return res.status(400).send(failRegister(result));
            }
            if (result === 'SUCCESS') {
                return res.status(200).send(successRegister);
                
            }
            return res.status(200).send(successRegister);
        } catch (error) {
            return res.status(500).send(failRegister(error));
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            if (result.error === 'MISSING_FIELDS') {
                throw new ApiError(400, 'Vui lòng điền đầy đủ thông tin đăng nhập');
            }

            if (result.error === 'INVALID_CREDENTIALS') {
                throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
            }

            if (result.error === 'ACCOUNT_UNVERIFIED') {
                throw new ApiError(403, 'Tài khoản của bạn chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản');
            }

            return new ApiSuccess(200, "Đăng nhập thành công", result).send(res);
        } catch (error) {
            console.log("Error:", error);
            return new ApiError(error.statusCode || 500, error.message, error.errors).send(res);
        }
    }
}

const successRegister = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .container {
            background: white;
            padding: 20px 40px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            text-align: center;
        }
        .container h1 {
            color: #4CAF50;
        }
        .container p {
            font-size: 1.2em;
        }
        .container .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1em;
            transition: background-color 0.3s;
        }
        .container .button:hover {
            background-color: #DBA510;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Thank You!</h1>
        <p>Your email has been successfully confirmed.</p>
        <p>You can now proceed to use our services.</p>
    </div>
</body>
</html>
`

const failRegister = (error) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #dc3545;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }
        .btn {
            background-color: #007bff;
            color: #fff;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            text-decoration: none;
            font-size: 1rem;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #2b2b2b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Confirmation Failed</h1>
        <p>Oops! Something went wrong. We were unable to confirm your email address.</p>
        <p>${error}</p>
        <p>Please check your email and try again, or click the button below to resend the confirmation email.</p>
    </div>
</body>
</html>
`

module.exports = new AuthController();