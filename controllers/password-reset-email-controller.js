const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { UserModel } = require('../models/user-model');
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate
} = require("../emails/password-reset-emailer");
const { sendSignupTokenVerification } = require('../emails/account');

// `secret` is passwordHash concatenated with user's
// createdAt value, so if someone malicious gets the
// token they still need a timestamp to hack it:
exports.usePasswordHashToMakeToken = ({
    password: passwordHash,
    _id: userId,
    createdAt
  }) => {
    // highlight-start
    const secret = passwordHash + "-" + createdAt
    const token = jwt.sign({ userId }, secret, {
      expiresIn: 3600 // 1 hour
    })
    // highlight-end
    return token
  }

  //// Sends an email IRL! ////
exports.sendPasswordResetEmail = async (req, res) => {
    const { email } = req.params
    console.log("Email for password change", email);
    let user;
    try {
    //   user = await UserModel.findOne({ email }).exec()
    user = await UserModel.findOne({ email });
    } catch (err) {
      res.status(404).json("No user with that email")
    }
    console.log("User fetched from DB ******",user);
    const token = exports.usePasswordHashToMakeToken(user)
    console.log("generated New Token ******",token);
    const url = getPasswordResetURL(user, token)
    const emailTemplate = resetPasswordTemplate(user, url)
    console.log(" emailTemplate emailTemplate",emailTemplate);
    sendSignupTokenVerification(user.email, user.username, token);
    // const sendEmail = () => {
    //   transporter.sendMail(emailTemplate, (err, info) => {
    //     if (err) {
    //     //   res.status(500).json("Error sending email")
    //     res.status(500).send(err);
    //     }
    //     console.log(`** Email sent **`, info)
    //   })
    // }
    // sendEmail();
  }

  exports.receiveNewPassword = async (req, res) => {
    const { userId, token } = req.params
    const { password } = req.body
    // highlight-start
    UserModel.findOne({ _id: userId })
      .then(async user => {
        const secret = user.password + "-" + user.createdAt
        const payload = jwt.decode(token, secret)
        if (payload.userId === user.id) {
            const hash = crypto.pbkdf2Sync(user._id.toString(),  crypto.randomBytes(16).toString('hex') , 1000, 64, `sha512`).toString(`hex`);
            const hashedNewPassword = await bcrypt.hash(password, 8)
        //   bcrypt.genSalt(10, function(err, salt) {
        //     // Call error-handling middleware:
        //     if (err) return
        //     bcrypt.hash(password, salt, function(err, hash) {
        //       // Call error-handling middleware:
        //       if (err) return
              UserModel.findOneAndUpdate({ _id: userId }, { password: hashedNewPassword })
                .then(() => res.status(202).json("Password changed accepted"))
                .catch(err => res.status(500).json(err))
        //     })
        //   })
        }
      })
      // highlight-end
      .catch(() => {
        res.status(404).json("Invalid user")
      })
  }