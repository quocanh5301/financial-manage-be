const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require('morgan');
// const db = require('./data/db');
const connectDB = require("./util/mongoDB");
const ApiError = require("./responses/apiError");
const ApiSuccess = require("./responses/apiSuccess");
const User = require("./models/userModel");


const app = express();
dotenv.config();
connectDB();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const userRoutes = require('./routes/user');
// const registerRoutes = require('./routes/register');
const authRoute = require('./routes/authRoute');
// const planRoutes = require('./routes/run_data');
// const runDataRoutes = require('./routes/run_data');
// const heartRateDataRoutes = require('./routes/heart_rate_data');
// const exerciseRoutes = require('./routes/exercise');



// app.use('/user', authenticateToken, userRoutes);
// app.use('/plan', authenticateToken, planRoutes);
// app.use('/runData', authenticateToken, runDataRoutes);
// app.use('/heartRateData', authenticateToken, heartRateDataRoutes);
// app.use('/exercise', authenticateToken, exerciseRoutes);
// app.use('/register', registerRoutes);
app.use('/auth', authRoute);

app.listen(3000);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!(token.sessionToken)) {
      return new ApiError(401, 'Token not provided').send(res);
  }

  jwt.verify(token.sessionToken, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) {
          return new ApiError(401, 'Invalid token: ' + error.message).send(res);//! dont do this here
      }

      try {
          console.log("User by ID:", user);
          const checkingUser = await User.findById(user.id);
          console.log("Found user!!!" + checkingUser);

          if (!checkingUser || checkingUser.sessionToken !== token.sessionToken) {
              return new ApiError(401, 'Token is not valid or expired').send(res);
          }
          
          next();
      } catch (error) {
          return "Authentication error: " + error;
      }
  });
}


