const rp = require('request-promise');

const SendPushNotificationToDevice = async (fcmToken, notificationTitle, notificationBody) => {
    const notificationFormat = {
        notification: {
            "title": notificationTitle,
            "body": notificationBody
        },
        "to": fcmToken
    };
    // console.log("Notifications :::::", notificationFormat)
    // const token = fcmToken;
    const url = 'https://fcm.googleapis.com/fcm/send';
    const authKey = 'key=AAAAg06JBfk:APA91bEl6ArHNOxGMucTEovZAfr5wK6AnbfOg60PFBFyJKLzacVgmQAXVPPO5V1wDsNkN8376xznRl4Ymtqe7ocbC0RZaU7nCO2RajO1-HaFG1_S9mKRORmE61AQsG-gl8dcEpYr6yBO';
    return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            url: url,
            body: notificationFormat,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authKey
            },
            json: true
        };

        rp(options)
            .then(function (resBody) {
                // console.log("resBody resBody", resBody)
                // POST succeeded...
                resolve(resBody)
            })
            .catch(function (err) {
                // POST failed...
                // console.log("Error Message POST", err);
                if (JSON.parse(JSON.stringify(err)).statusCode === 401) {

                } else {
                    const e = new Error(err);
                    reject(e);
                }
            });
    })
    // const options = {
    //     method: 'POST',
    //     url: url,
    //     body: {
    //         notification: notification
    //     }
    // };

    // rp(options)
    // .then(function (resBody) {
    //     // POST succeeded...
    //     resolve(resBody)
    // })
    // .catch(function (err) {
    //     // POST failed...
    //     if (JSON.parse(JSON.stringify(err)).statusCode === 401) {

    //     } else {
    //         const e = new Error(err);
    //         reject (e);
    //     }
    // });

    /*
var options = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
        some: 'payload'
    },
    json: true // Automatically stringifies the body to JSON
};
 
rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
    })
    .catch(function (err) {
        // POST failed...
    });

    */
    // { "notification": {
    //     "title": "$GOOG up 1.43% on the day",
    //     "body": "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
    //   },
    //   "to" : "dh0cQiSUj_Y:APA91bGwljiA94hz1OAd2f4wtMcu3RpplT5ezf5QXqg7J_MPE9PpAVcHQFy5y2w5kf0JQAN4-xECbbUkORkLlXV8mel4pAuV4rdoYXyG6D_5UICFOQ95YdBicZFLMd9GhNipJQ7IYoyn"
    // }
}

module.exports = {
    SendPushNotificationToDevice
}