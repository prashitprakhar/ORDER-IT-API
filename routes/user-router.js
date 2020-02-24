const express = require('express');
const router = new express.Router();
const authentication = require('../middleware/authentication');
const USER_CONTROLLER = require('./../controllers/user-controller');

router.post('/login', USER_CONTROLLER.USER_LOGIN_DETAILS);

router.post('/signup', USER_CONTROLLER.USER_SIGNUP_CONTROLLER);

router.post('/logout', authentication, USER_CONTROLLER.LOGOUT_USER_CONTROLLER);

router.post('/logoutAll', authentication, USER_CONTROLLER.LOGOUT_USER_ALL_LOGINS);

router.post('/createShopAccount', authentication, USER_CONTROLLER.CREATE_SHOP_ACCOUNT);

router.post('/deleteAccount', authentication, USER_CONTROLLER.DELETE_ACCOUNT);

router.post('/resetPassword', authentication, USER_CONTROLLER.USER_RESET_PASSWORD);

router.post('/sendOrderStatusPushNotification', USER_CONTROLLER.SEND_ORDER_STATUS_PUSH_NOTIFICATION);

router.post('/addNewAddress', authentication, USER_CONTROLLER.ADD_CUSTOMER_NEW_ADDRESS);

router.post('/customerSavedAddress', authentication, USER_CONTROLLER.GET_CUSTOMERS_SAVED_ADDRESSES);

// router.post('/checkLoginStatus', authentication, USER_CONTROLLER.CHECK_USER_LOGIN_CREDS);

module.exports = router;