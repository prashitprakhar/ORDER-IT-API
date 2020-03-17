const express = require('express');
const router = new express.Router();
const authentication = require('../middleware/authentication');
const USER_CONTROLLER = require('./../controllers/user-controller');

// router.get('/getObjectId', USER_CONTROLLER.GET_OBJECT_ID);

router.post('/login', USER_CONTROLLER.USER_LOGIN_DETAILS);

router.post('/signup', USER_CONTROLLER.USER_SIGNUP_CONTROLLER);

router.post('/logout', authentication, USER_CONTROLLER.LOGOUT_USER_CONTROLLER);

router.post('/logoutAll', authentication, USER_CONTROLLER.LOGOUT_USER_ALL_LOGINS);

router.post('/createShopAccount', authentication, USER_CONTROLLER.CREATE_SHOP_ACCOUNT);

router.post('/deleteAccount', authentication, USER_CONTROLLER.DELETE_ACCOUNT);

router.post('/resetPassword', USER_CONTROLLER.USER_RESET_PASSWORD);

router.post('/sendOrderStatusPushNotification', USER_CONTROLLER.SEND_ORDER_STATUS_PUSH_NOTIFICATION);

router.post('/addNewAddress', authentication, USER_CONTROLLER.ADD_CUSTOMER_NEW_ADDRESS);

router.post('/customerSavedAddress', authentication, USER_CONTROLLER.GET_CUSTOMERS_SAVED_ADDRESSES);

router.post('/updateUsageFlag', authentication, USER_CONTROLLER.UPDATE_ADDRESS_USAGE_FLAG);

router.post('/editAddressDetails', authentication, USER_CONTROLLER.EDIT_ADDRESS_DETAILS);

router.post('/deleteAddress', authentication, USER_CONTROLLER.DELETE_SPECIFIED_ADDRESS);

router.post('/getCustomerProfile', authentication, USER_CONTROLLER.GET_CUSTOMER_PROFILE_DETAILS);

router.post('/updateSelectableItemToCart', authentication, USER_CONTROLLER.ADD_REMOVE_SELECTABLE_ITEM_TO_CART);

router.post('/addNewBulkSelectableItemToCart', authentication, USER_CONTROLLER.ADD_BULK_SELECTABLE_ITEMS_TO_CART);

router.post('/updateCustomKGItemToCart', authentication, USER_CONTROLLER.ADD_REMOVE_CUSTOM_KG_ITEM_TO_CART);

router.post('/addNewBulkCustomKGItemToCart', authentication, USER_CONTROLLER.ADD_CUSTOM_KG_BULK_ITEM_TO_CART);

router.post('/updateCustomPackItemToCart', authentication, USER_CONTROLLER.ADD_REMOVE_CUSTOM_PACK_ITEM_TO_CART);

router.post('/addNewBulkCustomPackItemToCart', authentication, USER_CONTROLLER.ADD_CUSTOM_PACK_BULK_ITEM_TO_CART);

router.post('/updateCustomOrdersCart', authentication, USER_CONTROLLER.UPDATE_CUSTOM_ORDERS_CART);

router.post('/updateSelectableOrdersCart', authentication, USER_CONTROLLER.UPDATE_SELECTABLE_ORDERS_CART);

router.post('/removeCartItemPostOrder', authentication, USER_CONTROLLER.REMOVE_CART_ITEMS_POST_ORDER);

router.post('/updateCartsOnLogin', authentication, authentication, USER_CONTROLLER.UPDATE_CARTS_ON_LOGIN);

router.post('/getInitialLoginCartItems', authentication, USER_CONTROLLER.GET_INITIAL_LOGIN_ALL_CART_ITEMS);

router.post('/placeOrder', authentication, USER_CONTROLLER.PLACE_CUSTOMER_ORDER);

router.post('/customerCurrentOrder', authentication, USER_CONTROLLER.CUSTOMER_CURRENT_ORDER);

router.post('/getAllOrders', authentication, USER_CONTROLLER.CUSTOMER_ALL_ORDERS);

// router.post('/checkLoginStatus', authentication, USER_CONTROLLER.CHECK_USER_LOGIN_CREDS);

module.exports = router;