const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

var addressSchema = mongoose.Schema({
    // itemId: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     default: new mongoose.Types.ObjectId(),
    //     unique: true,
    //     index: true
    //     // default: null
    // },
    itemName: {
        type: String,
        trim: true
    },
    itemBrand: {
        type: String,
        trim: true
    },
    itemDescription : {
        type: String,
        trim: true
    },
    itemCategory: {
        type: String,
        trim: true
    },
    itemUndiscountedRate: {
        type: Number
        // required: true
    },
    itemWeight: {
        type: Number
        // required: true
    },
    itemUnit: {
        type: String,
        // required: true,
        // trim: true
    },
    isDiscountedAvailable: {
        type: Number,
        // required: true,
        // default: 0
    },
    itemDiscountedRate: {
        type: Number
        // required: true
    },
    discountAmount: {
        type: Number
        // required: true
    },
    discountPercentage: {
        type: Number
        // required: true
    },
    itemCount: {
        type: Number
        // required: true
    },
    itemAvailable: {
        type: Boolean
        // default: true
    },
    itemImageUrl: {
        type: String
        // required: true,
        // trim: true
    }
});

const ShopOfferedItemsSchema = new Schema({
    shopId: {
        type: String,
        required: true,
        trim: true
    },
    shopOfferedItemsList: [addressSchema]
});

ShopOfferedItemsSchema.methods.addNewItem = async function (newShopItem) {
    const shopDoc = this //this gives control over the current Shop Offered Items model

    shopDoc.shopOfferedItemsList = shopDoc.shopOfferedItemsList.concat(newShopItem);
    let shopDocSaved = await shopDoc.save();
    if (!shopDocSaved) {
        throw new Error('SHOP_ITEM_NOT_UPDATED')
    }
    return shopDocSaved;
}

const ShopOfferedItemsModel = mongoose.model('SHOP_OFFERED_ITEMS', ShopOfferedItemsSchema, 'SHOP_OFFERED_ITEMS');

module.exports = { ShopOfferedItemsModel };

/*
itemId: Math.random().toString(),
          itemName,
          itemBrand,
          itemDescription: 'No Description',
          itemCategory,
          itemUndiscountedRate,
          itemWeight,
          itemUnit: 'g',
          isDiscountedAvailable: parseFloat(discountPercentage) > 0 ? true : false,
          itemDiscountedRate: itemUndiscountedRate - parseFloat(discountPercentage) * itemUndiscountedRate / 100,
          discountAmount: 0,
          // tslint:disable-next-line: radix
          discountPercentage : parseInt(discountPercentage),
          itemCount: 0,
          itemAvailable: true,
          itemImageUrl: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y'
*/

//methods are instance specific
//Secret Message - @indilligenceisIntelligence+DiligenceWhichcreatesGeniuses&$
//secret Token - QGluZGlsbGlnZW5jZWlzSW50ZWxsaWdlbmNlK0RpbGlnZW5jZVdoaWNoY3JlYXRlc0dlbml1c2VzJiQ=
// UserSchema.methods.generateAuthToken = async function () {
//     const user = this //this gives control over the current user model
//     // const loggedInAt = new Date();
//     const token = jwt.sign({ _id: user._id.toString()}, 'QGluZGlsbGlnZW5jZWlzSW50ZWxsaWdlbmNlK0RpbGlnZW5jZVdoaWNoY3JlYXRlc0dlbml1c2VzJiQ=');
//     user.tokens = user.tokens.concat({ token });
//     user.lastLoggedInAt = new Date()
//     await user.save();

//     return token;
// }

//This was the manual way of hiding private details
// UserSchema.methods.getPublicProfile = function() {
//     const user = this;

//     const userObject = user.toObject();

//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// }

//alternate way is manipulating the toJSON Function itself
// UserSchema.methods.toJSON = function () {
//     const user = this;

//     const userObject = user.toObject();

//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// }

//For Login authentication
//statics are application specific
// UserSchema.statics.findByCredentials = async (email, password) => {
//     const user = await UserModel.findOne({ email })

//     if (!user) {
//         throw new Error('User not found')
//     }

//     const isMatch = await bcrypt.compare(password, user.password)

//     if (!isMatch) {
//         throw new Error('Please check your email and password')
//     }

//     return user;
// }

// UserSchema.statics.findByToken = async (token) => {
//     const user = await UserModel.findOne({ token })

//     if (!user) {
//         throw new Error('User Not logged in.');
//     }

//     return user;
// }


//Hash plain text password before saving
// UserSchema.pre('save', async function (next) {
//     const user = this;

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

