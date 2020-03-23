const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { UserModel } = require('../models/user-model');
const { TokenModel } = require('../models/token-verification-model');
const { sendSignupTokenVerification } = require('../emails/account');
const { CustomerProfileModel } = require('../models/customer-profile-model');
const { SelectableItemCartModel } = require('../models/selectable-items-cart.model');
const { CustomItemKGCartModel } = require('./../models/custom-items-kg-cart.model');
const { CustomItemPackCartModel } = require('./../models/custom-items-pack-cart.model');
const { CustomerOrdersModel } = require('./../models/customer-orders.model');
const { SendPushNotificationToDevice } = require('./../push-notification-module/push-notification');

// exports.GET_OBJECT_ID = async (req, res) => {
//     try {
//         const uniqueObjectId = await CustomItemKGCartModel.generateObjectId();
//         res.status(200).send(uniqueObjectId);
//     }
//     catch (e) {
//         res.status(400).send(e.toString())
//     }
// }

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
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
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
            if (!customerProfileDoc) {
                const deletedUserSignup = await UserModel.findOneAndDelete({ _id: user._id })
                throw new Error('SIGNUP_FAILED_WHILE_CUSTOMER_PROFILE_CREATION');
            }
        }
        const hash = crypto.pbkdf2Sync(user._id.toString(), crypto.randomBytes(16).toString('hex'), 1000, 64, `sha512`).toString(`hex`);
        const emailVerificationToken = new TokenModel({ _userId: user._id.toString(), token: hash });
        const verificationToken = await emailVerificationToken.save();
        sendSignupTokenVerification(user.email, user.username, verificationToken.token)
        res.status(201).send({ user, token })
    }
    catch (e) {
        const deletedUserSignup = await UserModel.findOneAndDelete({ _id: user._id })
        res.status(400).send(e.toString())
    }
}

exports.CREATE_SHOP_ACCOUNT = async (req, res) => {
    let userDetails = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        securePIN: req.body.securePIN
    });

    try {
        const user = await userDetails.save();
        const token = await user.generateAuthToken();
        const hash = crypto.pbkdf2Sync(user._id.toString(), crypto.randomBytes(16).toString('hex'), 1000, 64, `sha512`).toString(`hex`);
        const emailVerificationToken = new TokenModel({ _userId: user._id.toString(), token: hash });
        const verificationToken = await emailVerificationToken.save();
        sendSignupTokenVerification(user.email, user.username, verificationToken.token)
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e.toString())
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
        const user = await UserModel.findOneAndUpdate({ email }, { password: hashedPassword })
        res.status(201).send({ user })
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
    catch (e) {
        res.status(500).send(e.toString())
    }
}

exports.LOGOUT_USER_ALL_LOGINS = async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save();

        res.send();
    }
    catch (e) {
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
        let customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        if (customerProfileDoc.customerAddressList.length == 0) {
            addressDetails.isCurrentlyUsed = true
        }
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
        const customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        const customerSavedAddresses = customerProfileDoc.customerAddressList;
        res.status(200).json({ addressList: customerSavedAddresses })
    }
    catch (e) {
        res.status(500).send(e.toString());
    }
}

exports.UPDATE_ADDRESS_USAGE_FLAG = async (req, res) => {
    const userId = req.body.userId;
    const _id = req.body._id;

    try {
        const customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        let customerSpecifiedAddress = customerProfileDoc.customerAddressList.filter(element => element._id == _id);
        let customerAddressToBeUpdated = customerSpecifiedAddress[0];
        let otherCustomerAddresses = customerProfileDoc.customerAddressList.filter(element => element._id != _id);
        let updatedCustomerAddressesNonUsed = [];

        if (otherCustomerAddresses.length > 0) {
            otherCustomerAddresses.forEach(eachAddress => {
                eachAddress.isCurrentlyUsed = false;
                updatedCustomerAddressesNonUsed.push(eachAddress)
            })
        }

        customerAddressToBeUpdated.isCurrentlyUsed = !customerAddressToBeUpdated.isCurrentlyUsed;
        updatedCustomerAddressesNonUsed.unshift(customerAddressToBeUpdated)
        customerProfileDoc.customerAddressList = [...updatedCustomerAddressesNonUsed];
        const updatedCustomerProfileAddressList = await customerProfileDoc.save();
        res.status(200).send(updatedCustomerProfileAddressList)
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.EDIT_ADDRESS_DETAILS = async (req, res) => {
    const userId = req.body.userId;
    const _id = req.body._id;
    const addressCategory = req.body.addressCategory;
    const houseNumber = req.body.houseNumber;
    const addressLineOne = req.body.addressLineOne;
    const addressLineTwo = req.body.addressLineTwo;
    const pincode = req.body.pincode;
    const city = req.body.city;
    const state = req.body.state;
    const mobileNumber = req.body.mobileNumber;
    // const isCurrentlyUsed = req.body.isCurrentlyUsed;

    try {
        const customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        let specifiedAddress = customerProfileDoc.customerAddressList.find(element => element._id == _id);

        specifiedAddress.addressCategory = addressCategory;
        specifiedAddress.houseNumber = houseNumber;
        specifiedAddress.addressLineOne = addressLineOne;
        specifiedAddress.addressLineTwo = addressLineTwo;
        specifiedAddress.pincode = pincode;
        specifiedAddress.city = city;
        specifiedAddress.state = state;
        specifiedAddress.mobileNumber = mobileNumber;
        specifiedAddress.isCurrentlyUsed = specifiedAddress.isCurrentlyUsed;
        specifiedAddress.createdAt = specifiedAddress.createdAt;

        const updatedAddressDoc = await customerProfileDoc.save();

        res.status(200).send(updatedAddressDoc);
    }
    catch (e) {
        res.status(400).send(e.toString())
    }
}

exports.DELETE_SPECIFIED_ADDRESS = async (req, res) => {
    const userId = req.body.userId;
    const _id = req.body._id;

    try {
        const customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        let remainingAddress = customerProfileDoc.customerAddressList.filter(element => element._id != _id);
        customerProfileDoc.customerAddressList = remainingAddress;
        let updatedCustomerProfileDoc = await customerProfileDoc.save();

        res.status(201).send(updatedCustomerProfileDoc);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.GET_CUSTOMER_PROFILE_DETAILS = async (req, res) => {
    const userId = req.body.userId;

    try {
        const customerProfileDoc = await CustomerProfileModel.findOne({ userId: userId });
        res.status(201).send(customerProfileDoc);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_REMOVE_SELECTABLE_ITEM_TO_CART = async (req, res) => {
    const userId = req.body.userId;
    const selectableItem = req.body.selectableItem;

    try {
        const userSelectableItemDoc = await SelectableItemCartModel.findOne({ userId: userId });
        if (!userSelectableItemDoc) {
            const newSelectableItemsCartDoc = new SelectableItemCartModel({
                userId,
                selectableItemsList: []
            })
            const selectableItemsDoc = await newSelectableItemsCartDoc.save();
            const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(selectableItemsDoc, selectableItem);
            res.status(200).send(selectableItemCartDoc);
        } 
        else {
            const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(userSelectableItemDoc, selectableItem);
            res.status(200).send(selectableItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_BULK_SELECTABLE_ITEMS_TO_CART = async (req, res) => {
    const userId = req.body.userId;
    const selectableItemsList = req.body.selectableItemsList;

    try {
        const userSelectableItemDoc = await SelectableItemCartModel.findOne({ userId: userId });
        if (!userSelectableItemDoc) {
            const newSelectableItemsCartDoc = new SelectableItemCartModel({
                userId,
                selectableItemsList: []
            })
            const selectableItemsDoc = await newSelectableItemsCartDoc.save();
            const selectableItemCartDoc = await SelectableItemCartModel.addBulkSelectableItemInCart(selectableItemsDoc, selectableItemsList);
            res.status(200).send(selectableItemCartDoc);
        }
        else {
            const selectableItemCartDoc = await SelectableItemCartModel.addBulkSelectableItemInCart(userSelectableItemDoc, selectableItemsList);
            res.status(200).send(selectableItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_REMOVE_CUSTOM_PACK_ITEM_TO_CART = async (req, res) => {
    const userId = req.body.userId;
    const customPackItem = req.body.customPackItem;

    try {
        const userCustomPackItemDoc = await CustomItemPackCartModel.findOne({ userId: userId });
        if (!userCustomPackItemDoc) {
            const newCustomPackItemsCartDoc = new CustomItemPackCartModel({
                userId,
                customPackItemList: []
            })
            const customPackItemDocItemsDoc = await newCustomPackItemsCartDoc.save();
            const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(customPackItemDocItemsDoc, customPackItem);
            res.status(200).send(customPackItemCartDoc);
        } 
        else {
            const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(userCustomPackItemDoc, customPackItem);
            res.status(200).send(customPackItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_CUSTOM_PACK_BULK_ITEM_TO_CART = async (req, res) => {
    const userId = req.body.userId;
    const customPackBulkItemsList = req.body.customPackBulkItemsList;

    try {
        const userCustomPackItemDoc = await CustomItemPackCartModel.findOne({ userId: userId });
        if (!userCustomPackItemDoc) {
            const newCustomPackItemsCartDoc = new CustomItemPackCartModel({
                userId,
                customPackItemList: []
            })
            const customPackItemDocItemsDoc = await newCustomPackItemsCartDoc.save();
            const customPackBulkItemCartDoc = await CustomItemPackCartModel.addCustomPackBulkItemInCart(customPackItemDocItemsDoc, customPackBulkItemsList);
            res.status(200).send(customPackBulkItemCartDoc);
        } 
        else {
            const customPackBulkItemCartDoc = await CustomItemPackCartModel.addCustomPackBulkItemInCart(userCustomKGItemDoc, customPackBulkItemsList);
            res.status(200).send(customPackBulkItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.UPDATE_CUSTOM_ORDERS_CART = async (req, res) => {
    const userId = req.body.userId;
    const customPackItem = req.body.customPackItems;
    const customKGItem = req.body.customKGItems;

    try {
        if (customPackItem && customKGItem) {
            const userCustomPackItemDoc = await CustomItemPackCartModel.findOne({ userId: userId });
            if (!userCustomPackItemDoc) {
                const newCustomPackItemsCartDoc = new CustomItemPackCartModel({
                    userId,
                    customPackItemList: []
                })
                const customPackItemDocItemsDoc = await newCustomPackItemsCartDoc.save();
                const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(customPackItemDocItemsDoc, customPackItem);
            } else {
                const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(userCustomPackItemDoc, customPackItem);
            }
    
            const userCustomKGItemDoc = await CustomItemKGCartModel.findOne({ userId: userId });
            if (!userCustomKGItemDoc) {
                const newCustomKGItemsCartDoc = new CustomItemKGCartModel({
                    userId,
                    customKGItemList: []
                })
                const customKGItemDocItemsDoc = await newCustomKGItemsCartDoc.save();
                const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(customKGItemDocItemsDoc, customKGItem);
            } else {
                const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(userCustomKGItemDoc, customKGItem);
            }
            res.status(200).json({message: 'SUCCESS'});
        } else {
            throw new Error('ERROR_IN_CUSTOM_ITEM_UPDATE');
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.UPDATE_SELECTABLE_ORDERS_CART = async (req, res) => {
    const userId = req.body.userId;
    const selectableItem = req.body.selectableItem;

    try {
        if(selectableItem) {
            const userSelectableItemDoc = await SelectableItemCartModel.findOne({ userId: userId });
            if (!userSelectableItemDoc) {
                const newSelectableItemsCartDoc = new SelectableItemCartModel({
                    userId,
                    selectableItemsList: []
                })
                const selectableItemsDoc = await newSelectableItemsCartDoc.save();
                const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(selectableItemsDoc, selectableItem);
                // res.status(200).send(selectableItemCartDoc);
            } 
            else {
                const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(userSelectableItemDoc, selectableItem);
                // res.status(200).send(selectableItemCartDoc);
            }
            res.status(200).json({message: 'SUCCESS'});
        } else {
            throw new Error('ERROR_IN_SELECTABLE_ITEM_UPDATE');
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_REMOVE_CUSTOM_KG_ITEM_TO_CART = async (req, res) => {
    const userId = req.body.userId
    const customKGItem = req.body.customKGItem;

    try {
        const userCustomKGItemDoc = await CustomItemKGCartModel.findOne({ userId: userId });
        if (!userCustomKGItemDoc) {
            const newCustomKGItemsCartDoc = new CustomItemKGCartModel({
                userId,
                customKGItemList: []
            })
            const customKGItemDocItemsDoc = await newCustomKGItemsCartDoc.save();
            const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(customKGItemDocItemsDoc, customKGItem);
            res.status(200).send(customKGItemCartDoc);
        } 
        else {
            const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(userCustomKGItemDoc, customKGItem);
            res.status(200).send(customKGItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_CUSTOM_KG_BULK_ITEM_TO_CART = async (req, res) => {
    const userId = req.body.userId;
    const customKGBulkItemsList = req.body.customKGBulkItemsList;

    try {
        const userCustomKGItemDoc = await CustomItemKGCartModel.findOne({ userId: userId });
        if (!userCustomKGItemDoc) {
            const newCustomKGItemsCartDoc = new CustomItemKGCartModel({
                userId,
                customKGItemList: []
            })
            const customKGItemDocItemsDoc = await newCustomKGItemsCartDoc.save();
            const customKGBulkItemCartDoc = await CustomItemKGCartModel.addCustomKGBulkItemInCart(customKGItemDocItemsDoc, customKGBulkItemsList);
            res.status(200).send(customKGBulkItemCartDoc);
        } 
        else {
            const customKGBulkItemCartDoc = await CustomItemKGCartModel.addCustomKGBulkItemInCart(userCustomKGItemDoc, customKGBulkItemsList);
            res.status(200).send(customKGBulkItemCartDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.REMOVE_CART_ITEMS_POST_ORDER = async (req, res) => {
    const userId = req.body.userId;

    try {
        const userSelectableItemDoc = await SelectableItemCartModel.findOne({ userId: userId });
        if (userSelectableItemDoc) {
            const selectableItemCart = await SelectableItemCartModel.clearCart(userSelectableItemDoc);
        }
        
        const userCustomPackItemDoc = await CustomItemPackCartModel.findOne({ userId: userId });
        if (userCustomPackItemDoc) {
            const customPackCart = await CustomItemPackCartModel.clearCart(userCustomPackItemDoc);
        }
        
        const userCustomKGItemDoc = await CustomItemKGCartModel.findOne({ userId: userId });
        if (userCustomKGItemDoc) {
            const customKGCart = await CustomItemKGCartModel.clearCart(userCustomKGItemDoc);
        }

        res.status(201).json({message : 'CART_ITEMS_CLEARED_POST_ORDER'})
        
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.UPDATE_CARTS_ON_LOGIN = async (req, res) => {
    const userId = req.body.userId;
    const selectableItem = req.body.selectableItems;
    const customPackItem = req.body.customPackItems;
    const customKGItem = req.body.customKGItems;

    try {
        const userSelectableItemDoc = await SelectableItemCartModel.findOne({ userId: userId });
        if (!userSelectableItemDoc) {
            const newSelectableItemsCartDoc = new SelectableItemCartModel({
                userId,
                selectableItemsList: []
            })
            const selectableItemsDoc = await newSelectableItemsCartDoc.save();
            const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(selectableItemsDoc, selectableItem);
        } else {
            const selectableItemCartDoc = await SelectableItemCartModel.addSelectableItemInCart(userSelectableItemDoc, selectableItem);
        }

        const userCustomPackItemDoc = await CustomItemPackCartModel.findOne({ userId: userId });
        if (!userCustomPackItemDoc) {
            const newCustomPackItemsCartDoc = new CustomItemPackCartModel({
                userId,
                customPackItemList: []
            })
            const customPackItemDocItemsDoc = await newCustomPackItemsCartDoc.save();
            const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(customPackItemDocItemsDoc, customPackItem);
        } else {
            const customPackItemCartDoc = await CustomItemPackCartModel.addCustomPackItemInCart(userCustomPackItemDoc, customPackItem);
        }

        const userCustomKGItemDoc = await CustomItemKGCartModel.findOne({ userId: userId });
        if (!userCustomKGItemDoc) {
            const newCustomKGItemsCartDoc = new CustomItemKGCartModel({
                userId,
                customKGItemList: []
            })
            const customKGItemDocItemsDoc = await newCustomKGItemsCartDoc.save();
            const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(customKGItemDocItemsDoc, customKGItem);
            // res.status(200).send(customKGItemCartDoc);
        } else {
            const customKGItemCartDoc = await CustomItemKGCartModel.addCustomKGItemInCart(userCustomKGItemDoc, customKGItem);
        }
        res.status(200).json({message: 'SUCCESS'});

    }
    catch (e) {
        res.status(400).send(e.toString())
    }
}

exports.GET_INITIAL_LOGIN_ALL_CART_ITEMS = async (req, res) => {
    const userId = req.body.userId;

    try {
        const selectableItemsCartDoc = await SelectableItemCartModel.findOne({ userId : userId });
        const customKGCartItemsDoc = await CustomItemKGCartModel.findOne({ userId: userId });
        const customPackCartItemsDoc = await CustomItemPackCartModel.findOne({ userId: userId });
        let selectableItems = [];
        let customItemsKG = [];
        let customItemsPacks = [];
        if (selectableItemsCartDoc) {
            selectableItems = selectableItemsCartDoc;
        }

        if (customKGCartItemsDoc) {
            customItemsKG = customKGCartItemsDoc;
        }

        if (customPackCartItemsDoc) {
            customItemsPacks = customPackCartItemsDoc;
        }

        let response = {
            selectableItems,
            customItemsKG,
            customItemsPacks
        }
        res.status(201).send(response);

    }
    catch (e) {
        res.status(400).send(e.toString())
    }
}

exports.PLACE_CUSTOMER_ORDER = async (req, res) => {
    const userId = req.body.userId;
    const currentOrderDetails = req.body.orderDetails;

    try {
        const customerOrdersDoc = await CustomerOrdersModel.findOne({userId: userId});

        if(!customerOrdersDoc) {
            
            const newCustomerOrderDoc = new CustomerOrdersModel({
                userId,
                ordersList: []
            })
            
            // Create customerDoc
            const newCustomerOrdersDoc = await newCustomerOrderDoc.save();

            const customerNewOrderDoc = await CustomerOrdersModel.addNewOrder(newCustomerOrdersDoc, currentOrderDetails);

            res.status(201).send(customerNewOrderDoc);
        }
        else {
            const customerNewOrderDoc = await CustomerOrdersModel.addNewOrder(customerOrdersDoc, currentOrderDetails);

            res.status(201).send(customerNewOrderDoc);
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.CUSTOMER_CURRENT_ORDER = async (req, res) => {
    const userId = req.body.userId;
    
    try {
        const customerOrdersDoc = await CustomerOrdersModel.findOne({userId: userId});

        if (!customerOrdersDoc) {
            throw new Error('NO_ORDERS');
        }

        const customerCurrentOrder = customerOrdersDoc.ordersList[0];

        res.status(201).send(customerCurrentOrder);

    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.CUSTOMER_ALL_ORDERS = async (req, res) => {
    const userId = req.body.userId;

    try {
        const customerAllOrdersDoc = await CustomerOrdersModel.findOne({userId: userId});
        if(!customerAllOrdersDoc) {
            throw new Error('NO_ORDERS');
        }
        const ordersList = customerAllOrdersDoc.ordersList;
        res.status(200).send(ordersList);
    }
    catch (e) {
        res.status(400).send(e.toString());
    }

}

exports.SEND_ORDER_STATUS_PUSH_NOTIFICATION = async (req, res) => {
// fcmToken, notificationTitle, notificationBody
    const fcmToken = req.body.fcmToken;
    const notificationTitle = req.body.notificationTitle;
    const notificationBody = req.body.notificationBody;
    // console.log("fcmToken, notificationTitle, notificationBody", fcmToken, notificationTitle, notificationBody)
    try {
        const orderConfPushNotification = await SendPushNotificationToDevice(fcmToken, notificationTitle, notificationBody);
        res.status(201).json({message: 'SUCCESS'});
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
    // const orderConfPushNotification = await SendPushNotificationToDevice()
    // { "notification": {
    //     "title": "$GOOG up 1.43% on the day",
    //     "body": "$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day."
    //   },
    //   "to" : "dh0cQiSUj_Y:APA91bGwljiA94hz1OAd2f4wtMcu3RpplT5ezf5QXqg7J_MPE9PpAVcHQFy5y2w5kf0JQAN4-xECbbUkORkLlXV8mel4pAuV4rdoYXyG6D_5UICFOQ95YdBicZFLMd9GhNipJQ7IYoyn"
    // }
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