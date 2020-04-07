const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const CustomerProfileSchema = new Schema({
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
    username: {
        type: String,
        required: true,
        trim: true
    },
    customerAddressList: [{
        // addressId: { 
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     default: new mongoose.Types.ObjectId(),
        //     unique: true
        // },
        addressCategory: {
            type: String,
            trim: true,
            // required: true
        },
        houseNumber: {
            type: String,
            // required: true,
            trim: true
        },
        addressLineOne: {
            type: String,
            // required: true,
            trim: true
        },
        addressLineTwo: {
            type: String,
            trim: true
        },
        pincode: {
            type: Number,
            // required: true,
            trim: true
        },
        city: {
            type: String,
            // required: true,
            trim: true
        },
        state: {
            type: String,
            // required: true,
            trim: true
        },
        mobileNumber: {
            type: Number,
            // required: true,
            trim: true
        },
        isCurrentlyUsed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }],
    role: {
        type: String,
        required: true,
        trim: true
    },
    customerRating: {
        type: String,
        required: true,
        trim: true,
        default: '0'
    },
    customerImageUrl: {
        type: String,
        // required: true
    }
});

CustomerProfileSchema.statics.findByUserId = async (userId) => {
    const userProfile = await CustomerProfileModel.findOne({ userId })

    if (!userProfile) {
        throw new Error('USER_PROFILE_NOT_FOUND')
    }

    // const isMatch = await bcrypt.compare(password, user.password)

    // if (!isMatch) {
    //     throw new Error('Please check your email and password')
    // }

    return userProfile;
}

const CustomerProfileModel = mongoose.model('CUSTOMER_PROFILE_DETAILS', CustomerProfileSchema, 'CUSTOMER_PROFILE_DETAILS');

module.exports = { CustomerProfileModel };