const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = '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';

sgMail.setApiKey(sendGridAPIKey);

// sgMail.send({
//     to: 'support@indilligence.com',
//     from: 'support@indilligence.com',
//     subject : "This is a test email !",
//     text : "Email testing"
// })

const sendSignupTokenVerification = (email, username, token) => {
    let userVerificationLink = `https://indilligence.com/${token}`
    sgMail.send({
        to: email,
        from: 'support@indilligence.com',
        subject: "This is a test email !",
        text: `Hello ${username}. Please click the below link to verify your email.
            ${userVerificationLink}`
    })
    //console.log("Email Sent")
}

module.exports = {
    sendSignupTokenVerification
}