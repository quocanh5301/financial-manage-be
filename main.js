const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require('morgan');
const db = require('./data/db');
const bcrypt = require('bcrypt');// encrypt password

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const registerRoutes = require('./routes/register');
const authenticateRoutes = require('./routes/authenticate');
const planRoutes = require('./routes/run_data');
const runDataRoutes = require('./routes/run_data');
const heartRateDataRoutes = require('./routes/heart_rate_data');
const exerciseRoutes = require('./routes/exercise');



app.use('/user', authenticateToken, userRoutes);
app.use('/plan', authenticateToken, planRoutes);
app.use('/runData', authenticateToken, runDataRoutes);
app.use('/heartRateData', authenticateToken, heartRateDataRoutes);
app.use('/exercise', authenticateToken, exerciseRoutes);
app.use('/register', registerRoutes);
app.use('/authenticate', authenticateRoutes);

app.listen(3000);

function authenticateToken(req, res, next) {//! fix
  const authHeader = req.headers['authorization']; // Expecting "Bearer <TOKEN>"
  const accessToken = authHeader && authHeader.split(' ')[1]; // Extract token part after "Bearer"

  if (!accessToken) {
    return res.status(401).json({ mess: "Token not provided", code: 401 });
  }

  // Verify the token
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
    if (error) {
      return res.status(401).json({ mess: "Invalid token: " + error.message, code: 401 });
    }

    try {
      // Validate token against database
      const userQuery = "SELECT session_token FROM account_login_status WHERE user_id = $1";
      const userResult = await db.query(userQuery, [user.id]);

      if (userResult.length === 0 || userResult[0].session_token !== accessToken) {
        return res.status(401).json({ mess: "Token is not valid or expired", code: 401 });
      }

      req.user = user; // Attach user to the request object
      next();
    } catch (dbError) {
      return res.status(500).json({ mess: "Database error: " + dbError.message, code: 500 });
    }
  });
}
