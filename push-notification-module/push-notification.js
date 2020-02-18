const admin = require('firebase-admin');
const app = admin.initializeApp({
    credential: admin.credential.cert({
        type: "service_account",
        project_id: "orderitservices",
        private_key_id: "6e63e2dd943e6abb59456c16be6c7a0f21b73bf0",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDq5b1LwtUc0haY\nTWjvn/VI2DfhekcRjSkF7757kYhZxW30CkEaFOBNiyeThnM4qg9zbIxjPmQtEF78\nylH646ejWa1xB7XU6zcPsY2QGlMiPulkaUb9t2nbDtKueq2vE6+s35LuFzKbNt/l\nkn/2NXvqsI4Z8S468fYpSzvBJ/rBD+QV/PDcSFOoD4E3RJcDWFaIYHLuy10cw4P8\nztxNEs6u+L2jU/llPzT+JohBZzObJ7QmQqGyhvfo++ejun3x1C2sYnOgZJacTpFc\nuPLzo1qpm88AIT0dzPccRu90TFlPed9uaaVcFtcU2cQeJXS67+eaaK5O3NvE3Qg+\noz+w2dlxAgMBAAECggEABz50BBgwqc2fJZhs4MeXpnoyiPkpeWoCG/KCNuiB97YY\nt2Kx53EW32qn8GBVq9JEx+FkV/LWid7mywLInJqKMtsDDV4N67sgQiiOg3qTBJaY\n7IA5pf09c2RljLzFn+//u4P+kZSfZSgqp0y0C7P9C7u2T32qWGYvWk59ZoN03nYa\nSX2J2LEJ4PagjbgMP22YsjEU1IcnwURqk35pyIUVeM9qINZ0ykEuzzvrFUj/9hSH\ngS6ldhtY5FuA4WME9vlutosPMpGjoI+dtPbxhDeLgUdcy4B+QDOGL3D8Qnk8kDDN\nmU7sOhST/z8l9rTmnRk9KEAExXIwJeQI/V9IKA5LRQKBgQD2bi9S0VLL7tt/gEjb\nKi57pZA8Grjk0umKjqyk0bTNfHKMw/WjcO6AjoOmRGQkYuZNN5XrT8A6DKE636IA\nGEFepZLDGXCgiChciHUacyCQFdHxnw/NPBsTWsxd82NJLWQ7U0OFLBhi9/m77IbE\nWKWNAt1IeH1aOvEEkgxRv/rk5QKBgQD0BOcbsl8mK5SmVcl2cGZadta2qViC5Vpb\nu8Jm57wzupj8v+yAMQMgBvYSZrlqN926MAZs+QD8iKx4XJ+OXrCla5oXJs2vA/qv\nJ+3dJayH6R/kd+0gSlk1AUkfX45K4hU+2Dbk0B92Bj8/Jy04W86XVECxzx25MqtA\nQ2myKkcFnQKBgQD0ELT2BTNHn03tvZRq3CAlfhiYLq8okmuTOzNqGfhD/BlHqV1D\nfrn4wS1KIzo7f2gw2fi1kcsEszWMJalBBsTXhI0ShcOyeqfe3Zd9lsCNc872y17P\nGdSHGsqF0mRnOXmn+BNLdhzBCHBi2yOum017l3aqLAuarf2/VRa2cLmAsQKBgDKr\n5fXZZ2q8uASGYexnUMnOTa3moouj5syPw8Gss2cmg2hQzmKcSuLWrziI/k2xRijI\nmjz8xBispOvlh/h/bz0aiAfwtdt2/xJqPzmh/h7G6Sl/Qc1nwvh/yNhr9ldUdUb0\njQmcsjvG9lE96GUAo3jHNRv3P1vayrbwiL1HjDH9AoGBAIxdU4BrdiKSYTtCwxl2\nvCc95TkJS4anjn4ADuST663GyZM0T8b5YnhVlYhRvaJVeenSVqTHR7Y2txLm72RE\n3unDUfV1IyLlzXVKzgkBkYdvutjJ84QkbTz3Yg3wl1sk6ITBLX3uzJQpuTAlNBMV\nJN0NjISW6qiUpZHtdoU6g0JP\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-o1nqc@orderitservices.iam.gserviceaccount.com",
        client_id: "114746753887954456163",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o1nqc%40orderitservices.iam.gserviceaccount.com"
    }),
});

// var registrationToken = 'dh0cQiSUj_Y:APA91bGwljiA94hz1OAd2f4wtMcu3RpplT5ezf5QXqg7J_MPE9PpAVcHQFy5y2w5kf0JQAN4-xECbbUkORkLlXV8mel4pAuV4rdoYXyG6D_5UICFOQ95YdBicZFLMd9GhNipJQ7IYoyn';

// var message = {
//     notification: {
//         title: 'TEST NOTIFICATION FROM NODE.JS',
//         body: 'HOW ARE YOU ?'
//     },
//     token: registrationToken
// };

// Send a message to the device corresponding to the provided
// registration token.
exports.SEND_PUSH_NOTIFICATION = (message) => {
    admin.messaging().send(message)
    .then((response) => {
        // Response is a message ID string.
        // console.log('Successfully sent message:', response);
    })
    .catch((error) => {
        // console.log('Error sending message:', error);
    });
}