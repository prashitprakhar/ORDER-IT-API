const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/user-model');
const { TokenModel } = require('../models/token-verification-model');
const { sendSignupTokenVerification } = require('../emails/account');


exports.USER_LOGIN_DETAILS = async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // const badges = await UserBadgesModel.findByUserId(user._id)
        // res.send({ user: user.getPublicProfile(), token }) //This was the manual way
        res.send({ user, token }) //alternate way is manipulating the toJSON Function itself
    }
    catch (e) {
        // console.log("Error ::::::::::::", e)
        res.status(400).send()
    }
}

exports.USER_SIGNUP_CONTROLLER = async (req, res) => {
    let userDetails = new UserModel({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role: req.body.role,
        securePIN: req.body.securePIN
    });

    try {
        const user = await userDetails.save();
        const token = await user.generateAuthToken();
        const hash = crypto.pbkdf2Sync(user._id.toString(),  crypto.randomBytes(16).toString('hex') , 1000, 64, `sha512`).toString(`hex`);
        const emailVerificationToken = new TokenModel({ _userId: user._id.toString(), token: hash });
        // const newUserBadge = new UserBadgesModel({_userId: user._id.toString()})
        const verificationToken = await emailVerificationToken.save();
        // const newUserBadgeInfo = await newUserBadge.save();
        // const badgeInfo = await newUserBadgeInfo.addBadge();
        sendSignupTokenVerification(user.email, user.username, verificationToken.token)
        res.status(201).send({ user, token })
    }
    catch(e) {
        // console.log("Error occured in hashing",e)
        res.status(400).send(e)
    }
}

exports.CREATE_SHOP_ACCOUNT = async (req, res) => {
    let userDetails = new UserModel({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        role: req.body.role,
        securePIN: req.body.securePIN
    });

    try {
        const user = await userDetails.save();
        const token = await user.generateAuthToken();
        const hash = crypto.pbkdf2Sync(user._id.toString(),  crypto.randomBytes(16).toString('hex') , 1000, 64, `sha512`).toString(`hex`);
        const emailVerificationToken = new TokenModel({ _userId: user._id.toString(), token: hash });
        const verificationToken = await emailVerificationToken.save();
        sendSignupTokenVerification(user.email, user.username, verificationToken.token)
        res.status(201).send({ user, token })
    }
    catch(e) {
        res.status(400).send(e)
    }
}

exports.DELETE_ACCOUNT = async (req, res) => {
    const userIdForDeletion = req.body.userId;
    try {
        const shopAccountDeletion = await UserModel.findByIdAndDelete(userIdForDeletion);
        res.status(201).send({ shopAccountDeletion })
    }
    catch (e) {
        res.status(400).send(e)
    }
}

exports.USER_RESET_PASSWORD = async (req, res) => {
    const newPassword = req.body.password;
    const email = req.body.email;
    const securePin = req.body.securePIN;

    const hashedPassword = await bcrypt.hash(newPassword, 8)
    try {
        const checkUserCreds = await UserModel.findByEmailAndPin(email, securePin);
        console.log("USER found *****",checkUserCreds);
        const user = await UserModel.findOneAndUpdate({email}, {password: hashedPassword})
        res.status(201).send({user})
    }
    catch (e) {
        console.log("Error",e.toString())
        // const error = {
        //     Error: e.toString()
        // }
        res.status(400).send(e.toString())
    }
}

exports.LOGOUT_USER_CONTROLLER = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

        await req.user.save()

        res.send()
    }
    catch(e) {
        res.status(500).send(e)
    }
}

exports.LOGOUT_USER_ALL_LOGINS = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save();

        res.send();
    }
    catch(e) {
        res.status(500).send(e)
    }
}

// exports.CHECK_USER_LOGIN_CREDS = async (req, res) => {
//     try {
//         //const user = await UserModel.findByToken(req.body.token);
//         const userDetails = {
//             user : req.user,
//             token : req.token
//         }
//         res.send(userDetails)
//     }
//     catch(e) {
//         res.status(400).send();
//     }
// }