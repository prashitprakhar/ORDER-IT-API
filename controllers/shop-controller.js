// const crypto = require('crypto');
const mongoose = require('mongoose');
const { ShopProfileModel } = require('../models/shop-profile-model');
const { ShopOfferedItemsModel } = require('../models/shop-offered-items.model');
const { ShopOrderDetailsModel } = require('./../models/shop-orders.model');
const { CustomerOrdersModel } = require('./../models/customer-orders.model');
const { GeoSpatialModel } = require('./../models/geo-spatial.model');

// const { TokenModel } = require('../models/token-verification-model');
// const { sendSignupTokenVerification } = require('../emails/account');
/*
shopLongitude: {
        type: Number,
        required: false
    },
    shopLatitude: {
        type: Number,
        required: false
    }
*/

exports.CREATE_SHOP_PROFILE = async (req, res) => {
    const shopProfileDetails = new ShopProfileModel({
        shopId: req.body.shopId,
        userId: req.body.userId,
        email: req.body.email,
        shopName: req.body.shopName,
        shopAddressLineOne: req.body.shopAddressLineOne,
        shopAddressLineTwo: req.body.shopAddressLineTwo,
        shopPincode: req.body.shopPincode,
        shopCity: req.body.shopCity,
        shopState: req.body.shopState,
        shopMobileNumber: req.body.shopMobileNumber,
        role: req.body.role,
        shopType: req.body.shopType,
        shopRating: req.body.shopRating,
        firstOrderTime: req.body.firstOrderTime,
        lastOrderTime: req.body.lastOrderTime,
        isShopOpen: req.body.isShopOpen,
        shopImageUrl: req.body.shopImageUrl
    });
    try {
        const shopProfile = await shopProfileDetails.save();
        res.status(201).send({ shopProfile });
    }
    catch (e) {
        res.status(400).send(e)
    }
}

exports.GET_SHOP_PROFILE = async (req, res) => {
    const shopId = req.body.shopId;

    try {
        const shopProfile = await ShopProfileModel.findOne({ shopId: shopId });
        res.status(201).json(shopProfile)
    }
    catch (e) {
        res.status(401).send(e.toString());
    }
}

exports.GET_SHOP_OFFERED_ITEMS = async (req, res) => {
    const shopId = req.body.shopId;

    try {
        const shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        res.status(201).json(shopItemsDoc)
    }
    catch (e) {
        res.status(401).send(e.toString());
    }
}

exports.UPDATE_ITEM_DETAILS = async (req, res) => {
    const shopId = req.body.shopId;
    const _id = req.body._id;

    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });

        if (shopItemsDoc) {
            const shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item._id != _id);
            const updatedItemsDetails = {
                _id: _id,
                itemName: req.body.itemName,
                itemBrand: req.body.itemBrand,
                itemDescription: req.body.itemDescription,
                itemCategory: req.body.itemCategory,
                itemUndiscountedRate: req.body.itemUndiscountedRate,
                itemWeight: req.body.itemWeight,
                itemUnit: req.body.itemUnit,
                isDiscountedAvailable: req.body.isDiscountedAvailable,
                itemDiscountedRate: req.body.itemDiscountedRate,
                discountAmount: req.body.discountAmount,
                discountPercentage: req.body.discountPercentage,
                itemCount: req.body.itemCount,
                itemAvailable: req.body.itemAvailable,
                itemImageUrl: req.body.itemImageUrl
            }

            shopItemsFiltered.push(updatedItemsDetails);

            shopItemsDoc.shopOfferedItemsList = shopItemsFiltered;

            let updatedShopItemsDoc = await shopItemsDoc.save();

            res.status(201).send(updatedShopItemsDoc)
        }
        else {
            throw new Error('NO_DOC_FOUND')
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.DELETE_ITEM = async (req, res) => {
    const shopId = req.body.shopId;
    const _id = req.body._id;
    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        if (shopItemsDoc) {
            const shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item._id != _id);
            shopItemsDoc.shopOfferedItemsList = shopItemsFiltered;
            let updatedShopItemsDoc = await shopItemsDoc.save();
            res.status(201).send(updatedShopItemsDoc)
        }
        else {
            throw new Error('NO_DOC_FOUND')
        }
    } catch (err) {
        res.status(400).send(e.toString());
    }
}

exports.CHANGE_ITEM_AVAILABILITY = async (req, res) => {
    const shopId = req.body.shopId;
    const _id = req.body._id;
    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        if (shopItemsDoc) {
            let shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item._id != _id);
            let itemDetails = shopItemsDoc.shopOfferedItemsList.find(item => item._id == _id);
            if (itemDetails) {
                itemDetails.itemAvailable = !itemDetails.itemAvailable;
                shopItemsFiltered.push(itemDetails);
                shopItemsDoc.shopOfferedItemsList = shopItemsFiltered;
                let updatedShopItemsDoc = await shopItemsDoc.save();
                res.status(201).send(updatedShopItemsDoc)
            }
            else {
                throw new Error('NO_ITEM_FOUND')
            }
        }
        else {
            throw new Error('NO_DOC_FOUND')
        }
    } catch (err) {
        res.status(400).send(err.toString());
    }
}

exports.CHANGE_SHOP_AVAILABILITY = async (req, res) => {
    const shopId = req.body.shopId;
    try {
        let shopProfileDoc = await ShopProfileModel.findOne({ shopId: shopId });
        if (shopProfileDoc) {
            shopProfileDoc.isShopOpen = !shopProfileDoc.isShopOpen;
            const updateShopProfile = await shopProfileDoc.save();
            res.status(201).send(updateShopProfile);
        }
        else {
            throw new Error("NO_DOC_FOUND");
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.ADD_ITEMS_FOR_SHOP = async (req, res) => {
    const shopId = req.body.shopId;
    const shopOfferedNewItem = {
        itemName: req.body.itemName,
        itemBrand: req.body.itemBrand,
        itemDescription: req.body.itemDescription,
        itemCategory: req.body.itemCategory,
        itemUndiscountedRate: req.body.itemUndiscountedRate,
        itemWeight: req.body.itemWeight,
        itemUnit: req.body.itemUnit,
        isDiscountedAvailable: req.body.isDiscountedAvailable,
        itemDiscountedRate: req.body.itemDiscountedRate,
        discountAmount: req.body.discountAmount,
        discountPercentage: req.body.discountPercentage,
        itemCount: req.body.itemCount,
        itemAvailable: req.body.itemAvailable,
        itemImageUrl: req.body.itemImageUrl
    }

    try {
        const shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        if (shopItemsDoc) {
            const shopOfferedItemsList = await shopItemsDoc.addNewItem(shopOfferedNewItem);
            res.status(201).send({ shopOfferedItemsList });
        }
        else {
            const newShopItemsList = new ShopOfferedItemsModel({
                shopId: shopId,
                shopOfferedItemsList: [{
                    itemName: req.body.itemName,
                    itemBrand: req.body.itemBrand,
                    itemDescription: req.body.itemDescription,
                    itemCategory: req.body.itemCategory,
                    itemUndiscountedRate: req.body.itemUndiscountedRate,
                    itemWeight: req.body.itemWeight,
                    itemUnit: req.body.itemUnit,
                    isDiscountedAvailable: req.body.isDiscountedAvailable,
                    itemDiscountedRate: req.body.itemDiscountedRate,
                    discountAmount: req.body.discountAmount,
                    discountPercentage: req.body.discountPercentage,
                    itemCount: req.body.itemCount,
                    itemAvailable: req.body.itemAvailable,
                    itemImageUrl: req.body.itemImageUrl
                }]
            })
            const shopDoc = await newShopItemsList.save();
            res.status(201).send({ shopDoc });
        }
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.GET_ALL_SHOPS = async (req, res) => {
    try {
        const allShops = await ShopProfileModel.find({});
        res.status(200).send(allShops)
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}

exports.GET_ALL_RELEVANT_SHOPS = async (req, res) => {
    const coordinates = req.body.coordinates;
    
    try {
        const nearestShopDetails = await GeoSpatialModel.find({
            location: {
             $near: {
              $maxDistance: 200,
              $geometry: {
               type: "Point",
               coordinates: [coordinates[0], coordinates[1]]
              }
             }
            }
           });
           const nearestShopUserIds = nearestShopDetails.map(eachShop => eachShop.userId);
           const uniqueShopIds = [...new Set(nearestShopUserIds)];
           console.log("uniqueShopIds uniqueShopIds", uniqueShopIds);
           const nearestAvailableShops = await ShopProfileModel.find({shopId : {$in : uniqueShopIds}});
           res.status(200).send(nearestAvailableShops);
    }   
    catch(e) {
        res.status(400).send(e.toString())
    }
    
    //    .find((error, results) => {
    //     if (error) console.log(error);
    //     console.log(JSON.stringify(results, 0, 2));
    //    });
}

exports.GET_SHOP_OFFERED_ITEMS_FOR_CUSTOMERS = async (req, res) => {
    const shopId = req.body.shopId;

    try {
        const shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        res.status(201).json(shopItemsDoc)
    }
    catch (e) {
        res.status(401).send(e.toString());
    }
}

exports.GET_SHOP_PROFILE_FOR_CUSTOMERS = async (req, res) => {
    const shopId = req.body.shopId;

    try {
        const shopProfile = await ShopProfileModel.findOne({ shopId: shopId });
        res.status(201).json(shopProfile)
    }
    catch (e) {
        res.status(401).send(e.toString());
    }
}

// exports.ADD_NEW_ORDER = async (req, res) => {
//     const shopId = req.body.shopId;
// // ShopOrderDetailsModel
//     const userId = req.body.userId;
//     const currentOrderDetails = req.body.orderDetails;
//     // console.log("shopId", shopId);
//     // console.log("userId", userId);
//     // console.log("currentOrderDetails", currentOrderDetails);

//     try {
//         const shopOrderDoc = await ShopOrderDetailsModel.findOne({shopId: shopId, userId: userId});

//         if(!shopOrderDoc) {
//             const newShopDoc = new ShopOrderDetailsModel({
//                 shopId: shopId,
//                 userId: userId,
//                 ordersList: currentOrderDetails
//             });

//             const orderUpdateDoc = await newShopDoc.save();
//             res.status(201).send(orderUpdateDoc);
//         }

//         const inProgressOrder = shopOrderDoc.ordersList.find(element => element.orderStatus === 'PROGRESS');

//         if(inProgressOrder) {
//             throw new Error('OTHER_ORDER_IN_PROGRESS');
//         }

//         const orderUpdateDoc = await ShopOrderDetailsModel.updateOrder(shopOrderDoc, currentOrderDetails);

//         res.status(201).send(orderUpdateDoc)
//     }
//     catch (e) {
//         res.status(400).send(e.toString())
//     }

// }

exports.GET_ACTIVE_ORDERS = async (req, res) => {
    const shopId = req.body.shopId;

    try {

        const shopOrderDoc = await ShopOrderDetailsModel.find({shopId: shopId});

        if(!shopOrderDoc) {
            throw new Error('NO_ORDERS');
        }

        let INProgressOrder = [];

        shopOrderDoc.forEach(eachUserOrder => {
            let inProgressOrder = eachUserOrder.ordersList.find(element => element.orderStatus === 'PROGRESS' || element.orderStatus === 'PACKED' || element.orderStatus === 'OUTFORDELIVERY');

            if(inProgressOrder) {
                INProgressOrder.push(eachUserOrder);
            }
        })

        res.status(200).send(INProgressOrder);
    }
    catch (e) {
        res.status(401).send(e.toString());
    }
}

exports.UPDATE_USER_ORDER = async (req, res) => {

}

exports.GET_COMPLETED_ORDERS = async (req, res) => {

    const shopId = req.body.shopId;

    try {

        const shopOrderDoc = await ShopOrderDetailsModel.find({shopId: shopId});

        if(!shopOrderDoc) {
            throw new Error('NO_ORDERS_DOCUMENTS');
        }

        let completedOrderList = [];

        shopOrderDoc.forEach(eachOrder => {
            let completedOrder = eachOrder.ordersList.filter(element => element.orderStatus === 'COMPLETE')
            if(completedOrder.length > 0) {
                completedOrderList = [...completedOrderList, completedOrder]
            }
        })

        // const completedOrders = shopOrderDoc.ordersList.filter(element => element.orderStatus === 'COMPLETE');

        res.status(201).send(completedOrderList)

    }
    catch (e) {
        res.status(401).send(e.toString())
    }

}

exports.GET_ALL_ORDERS = async (req, res) => {

    const shopId = req.body.shopId;

    try {
        const shopOrderDoc = await ShopOrderDetailsModel.find({shopId: shopId});

        if(!shopOrderDoc) {
            throw new Error('NO_ORDERS')
        }

        res.status(201).send(shopOrderDoc)
    }
    catch (e) {
        res.status(401).send(e.toString());
    }

}

exports.CHANGE_ORDER_STATUS = async (req, res) => {
    const shopId = req.body.shopId;
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const orderStatus = req.body.orderStatus;
    const previousOrderStatus = req.body.previousOrderStatus;

    try {
        const shopOrderDoc = await ShopOrderDetailsModel.findOne({shopId: shopId, userId: userId});

        const customerOrderDoc = await CustomerOrdersModel.findOne({userId: userId});

        if(!shopOrderDoc || !customerOrderDoc) {
            throw new Error('CANNOT_CHANGE_ORDER_STATUS');
        }

        let currentShopOrder = shopOrderDoc.ordersList.find(element => element.orderId === orderId);

        let currentCustomerOrder = customerOrderDoc.ordersList.find(element => element.orderId === orderId);

        if(!currentShopOrder || !currentCustomerOrder) {
            throw new Error('ORDER_NOT_FOUND');
        }

        const statusUpdatedOrder = await ShopOrderDetailsModel.updateOrderStatus(shopOrderDoc, orderId, orderStatus);

        const statusUpdatedCustomerOrder = await CustomerOrdersModel.updateOrderStatus(customerOrderDoc, orderId, orderStatus);

        res.status(201).send({"message" : "SUCCESS"})

    }
    catch (e) {
        const shopOrderDoc = await ShopOrderDetailsModel.findOne({shopId: shopId, userId: userId});

        const customerOrderDoc = await CustomerOrdersModel.findOne({userId: userId});

        const statusUpdatedOrder = await ShopOrderDetailsModel.updateOrderStatus(shopOrderDoc, orderId, previousOrderStatus);

        const statusUpdatedCustomerOrder = await CustomerOrdersModel.updateOrderStatus(customerOrderDoc, orderId, previousOrderStatus);

        res.status(400).send(e.toString())
    }

}

exports.CHANGE_PAYMENT_STATUS = async (req, res) => {
    const shopId = req.body.shopId;
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    const orderStatus = req.body.orderStatus;
    const previousOrderStatus = req.body.previousOrderStatus;

    try {
        const shopOrderDoc = await ShopOrderDetailsModel.findOne({shopId: shopId, userId: userId});

        const customerOrderDoc = await CustomerOrdersModel.findOne({userId: userId});

        if(!shopOrderDoc || !customerOrderDoc) {
            throw new Error('CANNOT_CHANGE_ORDER_PAYMENT_STATUS');
        }

        let currentShopOrder = shopOrderDoc.ordersList.find(element => element.orderId === orderId);

        let currentCustomerOrder = customerOrderDoc.ordersList.find(element => element.orderId === orderId);

        if(!currentShopOrder || !currentCustomerOrder) {
            throw new Error('ORDER_NOT_FOUND');
        }

        const statusUpdatedOrder = await ShopOrderDetailsModel.updatePaymentStatus(shopOrderDoc, orderId, orderStatus);

        const statusUpdatedCustomerOrder = await CustomerOrdersModel.updatePaymentStatus(customerOrderDoc, orderId, orderStatus);

        res.status(201).send({"message" : "SUCCESS"})

    }
    catch (e) {
        const shopOrderDoc = await ShopOrderDetailsModel.findOne({shopId: shopId, userId: userId});

        const customerOrderDoc = await CustomerOrdersModel.findOne({userId: userId});

        const statusUpdatedOrder = await ShopOrderDetailsModel.updatePaymentStatus(shopOrderDoc, orderId, previousOrderStatus);

        const statusUpdatedCustomerOrder = await CustomerOrdersModel.updatePaymentStatus(customerOrderDoc, orderId, previousOrderStatus);

        res.status(400).send(e.toString())
    }
}


// Server Key FCM - AAAAg06JBfk:APA91bEl6ArHNOxGMucTEovZAfr5wK6AnbfOg60PFBFyJKLzacVgmQAXVPPO5V1wDsNkN8376xznRl4Ymtqe7ocbC0RZaU7nCO2RajO1-HaFG1_S9mKRORmE61AQsG-gl8dcEpYr6yBO