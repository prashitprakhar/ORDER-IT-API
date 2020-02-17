// const crypto = require('crypto');
const mongoose = require('mongoose');
const { ShopProfileModel } = require('../models/shop-profile-model');
const { ShopOfferedItemsModel } = require('./../models/shop-offered-items-model');

// const { TokenModel } = require('../models/token-verification-model');
// const { sendSignupTokenVerification } = require('../emails/account');

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
    const itemId = req.body.itemId;

    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });

        if (shopItemsDoc) {
            const shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item.itemId != itemId);
            const updatedItemsDetails = {
                itemId: itemId,
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
    const itemId = req.body.itemId;
    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        if (shopItemsDoc) {
            const shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item.itemId != itemId);
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
    const itemId = req.body.itemId;
    try {
        let shopItemsDoc = await ShopOfferedItemsModel.findOne({ shopId: shopId });
        if (shopItemsDoc) {
            let shopItemsFiltered = shopItemsDoc.shopOfferedItemsList.filter(item => item.itemId != itemId);
            let itemDetails = shopItemsDoc.shopOfferedItemsList.find(item => item.itemId == itemId);
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

            // shopItemsDoc.shopOfferedItemsList = shopItemsFiltered;
            // let updatedShopItemsDoc = await shopItemsDoc.save();
            // res.status(201).send(updatedShopItemsDoc)
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
        //isShopOpen
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
    // ShopProfileModel
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
