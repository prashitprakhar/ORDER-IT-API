const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const ShopProfileSchema = new Schema({
    shopId: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    shopAddressLineOne: {
        type: String,
        required: true,
        trim: true
    },
    shopAddressLineTwo: {
        type: String,
        required: true,
        trim: true
    },
    shopPincode: {
        type: Number,
        required: true,
        trim: true
    },
    shopCity: {
        type: String,
        required: true,
        trim: true
    },
    shopState: {
        type: String,
        required: true,
        trim: true
    },
    shopMobileNumber: {
        type: Number,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    shopType: {
        type: String,
        required: true,
        trim: true
    },
    shopRating: {
        type: String,
        required: true,
        trim: true
    },
    firstOrderTime: {
        type: String,
        required: true,
        trim: true
    },
    lastOrderTime: {
        type: String,
        required: true,
        trim: true
    },
    isShopOpen: {
        type: Boolean,
        required: true
    },
    shopImageUrl: {
        type: String,
        required: true
    },
    shopFCMToken: {
        type: String,
        required: false
    }
});

const ShopProfileModel = mongoose.model('SHOP_PROFILE_DETAILS', ShopProfileSchema, 'SHOP_PROFILE_DETAILS');

module.exports = { ShopProfileModel };