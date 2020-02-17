const express = require('express');
const router = new express.Router();
const authentication = require('../middleware/authentication');
const SHOP_CONTROLLER = require('./../controllers/shop-controller');

// router.post('/login', USER_CONTROLLER.USER_LOGIN_DETAILS);

router.post('/createShopProfile', SHOP_CONTROLLER.CREATE_SHOP_PROFILE);

router.post('/getShopProfile', authentication, SHOP_CONTROLLER.GET_SHOP_PROFILE);

router.post('/addShopItems', authentication, SHOP_CONTROLLER.ADD_ITEMS_FOR_SHOP);

router.post('/getShopOfferedItems', authentication, SHOP_CONTROLLER.GET_SHOP_OFFERED_ITEMS);

router.post('/updateItemDetails', authentication, SHOP_CONTROLLER.UPDATE_ITEM_DETAILS);

router.post('/deleteItem', authentication, SHOP_CONTROLLER.DELETE_ITEM);

router.post('/changeItemAvailability', authentication, SHOP_CONTROLLER.CHANGE_ITEM_AVAILABILITY);

router.post('/changeShopOpenStatus', authentication, SHOP_CONTROLLER.CHANGE_SHOP_AVAILABILITY);

router.get('/getAllShops', SHOP_CONTROLLER.GET_ALL_SHOPS);

router.post('/getShopOfferedItemsForCustomers', SHOP_CONTROLLER.GET_SHOP_OFFERED_ITEMS_FOR_CUSTOMERS);

router.post('/getShopProfileUnauthenticated', SHOP_CONTROLLER.GET_SHOP_PROFILE_FOR_CUSTOMERS);

// router.post('/signup', USER_CONTROLLER.USER_SIGNUP_CONTROLLER);

// router.post('/logout', authentication, USER_CONTROLLER.LOGOUT_USER_CONTROLLER);

// router.post('/logoutAll', authentication, USER_CONTROLLER.LOGOUT_USER_ALL_LOGINS);

// router.post('/checkLoginStatus', authentication, USER_CONTROLLER.CHECK_USER_LOGIN_CREDS);

module.exports = router;