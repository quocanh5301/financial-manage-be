const firebaseAdmin = require('firebase-admin');
var serviceAccount = require("./financial-83799-firebase-adminsdk-fbsvc-79fb528622.json");


firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const sendNotification = async (deviceTokenList, title, content) => {
    const message = {
      data: { title: title, content: content },
      tokens: deviceTokenList,
    };
    await firebaseAdmin.messaging().sendEachForMulticast(message)
      .then((response) => {
        console.log('sendNotificationTo ' + response.failureCount + ' messages were not sent');
        console.log('sendNotificationTo ' + response.successCount + ' messages were sent successfully');
      });
  };

module.exports = {
    sendNotification: sendNotification,
}

//use
// const firebase = require('../util/firebase');
// const { messaging } = firebase;
// messaging.sendToDevice(token, payload, options);
// messaging.sendMulticast(message);
// messaging.sendAll(message);
// messaging.send(message);