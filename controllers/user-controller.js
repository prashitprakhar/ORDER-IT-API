const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/user-model');
const { TokenModel } = require('../models/token-verification-model');
const { sendSignupTokenVerification } = require('../emails/account');
const { CustomerProfileModel } = require('../models/customer-profile-model');


exports.USER_LOGIN_DETAILS = async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token }) //alternate way is manipulating the toJSON Function itself
    }
    catch (e) {
        res.status(400).send(e.toString())
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
        if (req.body.role !== 'ENTERPRISE_PARTNER') {
            let customerProfile = new CustomerProfileModel({
                userId: user._id,
                email: req.body.email,
                username: req.body.username,
                role: req.body.role,
                customerRating: '0',
                customerImageUrl: ''
            });

            let customerProfileDoc = await customerProfile.save();
            if(!customerProfileDoc) {
                const deletedUserSignup = await UserModel.findOneAndDelete({_id: user._id})
                throw new Error('SIGNUP_FAILED_WHILE_CUSTOMER_PROFILE_CREATION');
            }
        } 
        const hash = crypto.pbkdf2Sync(user._id.toString(),  crypto.randomBytes(16).toString('hex') , 1000, 64, `sha512`).toString(`hex`);
        const emailVerificationToken = new TokenModel({ _userId: user._id.toString(), token: hash });
        const verificationToken = await emailVerificationToken.save();
        sendSignupTokenVerification(user.email, user.username, verificationToken.token)
        res.status(201).send({ user, token })
    }
    catch(e) {
        const deletedUserSignup = await UserModel.findOneAndDelete({_id: user._id})
        res.status(400).send(e.toString())
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
        res.status(400).send(e.toString())
    }
}

exports.USER_RESET_PASSWORD = async (req, res) => {
    const newPassword = req.body.password;
    const email = req.body.email;
    const securePin = req.body.securePIN;

    const hashedPassword = await bcrypt.hash(newPassword, 8)
    try {
        const checkUserCreds = await UserModel.findByEmailAndPin(email, securePin);
        const user = await UserModel.findOneAndUpdate({email}, {password: hashedPassword})
        res.status(201).send({user})
    }
    catch (e) {
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
        res.status(500).send(e.toString())
    }
}

exports.LOGOUT_USER_ALL_LOGINS = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save();

        res.send();
    }
    catch(e) {
        res.status(500).send(e.toString())
    }
}

// exports.UPDATE_USER_ADDRESS_DETAILS = async (req, res) => {
//     // CustomerProfileModel
//     const userId = req.body.userId;
//     // const userName = req.body.userName;
//     const addressCategory = req.body.addressCategory;
//     const houseNumber = req.body.houseNumber;
//     const addressLineOne = req.body.addressLineOne;
//     const addressLineTwo = req.body.addressLineTwo;
//     const pincode = req.body.pincode;
//     const city = req.body.city;
//     const state = req.body.state;
//     const mobileNumber = req.body.mobileNumber;
//     // const role = req.body.role;
//     // const customerRating = req.body.customerRating;
//     // const customerImageUrl = req.body.customerImageUrl;

//     try {
//         let userProfile = await CustomerProfileModel.findByUserId(userId);

//         const adderessDetails = {
//             addressCategory,
//             houseNumber,
//             addressLineOne,
//             addressLineTwo,
//             pincode,
//             city,
//             state,
//             mobileNumber
//         }
//         userProfile.customerAddressList.push(adderessDetails);
//         const userProfileUpdate = 
//     }
//     catch (err) {

//     }
// }

exports.ADD_CUSTOMER_NEW_ADDRESS = async (req, res) => {

    const userId = req.body.userId;
    const addressDetails = {
        addressCategory: req.body.addressCategory,
        houseNumber: req.body.houseNumber,
        addressLineOne: req.body.addressLineOne,
        addressLineTwo: req.body.addressLineTwo,
        pincode: req.body.pincode,
        city: req.body.city,
        state: req.body.state,
        mobileNumber: req.body.mobileNumber,
        isCurrentlyUsed: req.body.isCurrentlyUsed
    }

    try {
        let customerProfileDoc = await CustomerProfileModel.findOne({userId: userId});
        customerProfileDoc.customerAddressList.push(addressDetails);
        let updatedCustomerProfile = await customerProfileDoc.save();
        res.status(201).send(updatedCustomerProfile);
    }
    catch (e) {
        res.status(500).send(e.toString());
    }

}

exports.GET_CUSTOMERS_SAVED_ADDRESSES = async (req, res) => {
    const userId = req.body.userId;

    try {
        const customerProfileDoc = await CustomerProfileModel.findOne({userId: userId});
        const customerSavedAddresses = customerProfileDoc.customerAddressList;
        res.status(200).json({addressList : customerSavedAddresses})
    }
    catch (e) {
        res.status(500).send(e.toString());
    }
}

exports.SEND_ORDER_STATUS_PUSH_NOTIFICATION = async (req, res) => {

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