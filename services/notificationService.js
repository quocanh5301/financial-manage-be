const User = require("../models/userModel");
const firebase = require('../util/firebase');

class NotificationService {
    async sendNotification(userIDList, title, content) {
        try {
            // device token list
            const firebaseToken = await User.find({ _id: { $in: userIDList } }).select('firebaseToken');
            console.log("Firebase Token:", firebaseToken);
            // send noti
            firebase.sendNotification(firebaseToken, title, content);
            return "SUCCESS";
        } catch (error) {
            console.log("Error:", error);
            return "FAIL";
        }
    }

    async saveNotiToDB(){
        
    }

    async sendToken(token, userId) {
        try {
            //save token from user to mongodb
            const user = await User.findById(userId);
            user.firebaseToken = token;
            await user.save();
            return "SUCCESS";
        } catch (error) {
            console.log("Error:", error);
            return "FAIL";
        }

    }
}

module.exports = new NotificationService();