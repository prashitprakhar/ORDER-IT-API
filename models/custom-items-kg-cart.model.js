const mongoose = require('mongoose');
// const validator = require('validator');

const Schema = mongoose.Schema;

const CustomItemKGCartSchema = new Schema({
    userId : {
        type: String,
        required: true,
        trim: true
    },
    customKGItemList: [{
        itemId: {
            type: String,
            trim: true
        },
        shopId: {
            type: String,
            trim: true
        },
        itemName: {
            type: String,
            trim: true
        },
        itemCount: {
            type: Number,
            trim: true
        },
        itemUnit: {
            type: String,
            trim: true
        },
        totalPrice: {
            type: Number,
            trim: true
        },
        itemDiscountedRate: {
            type: Number,
            trim: true
        },
        itemWeight: {
            type: Number,
            trim: true
        },
        orderType: {
            type: String,
            trim: true
        },
        shopName: {
            type: String,
            trim: true
        }
    }]
});

// CustomItemKGCartSchema.statics.generateObjectId = async () => {
//     let id = mongoose.Types.ObjectId();
//     if (!id) {
//         throw new Error('COULDNOT_GENERATE_OBJECT_ID')
//     }
//     return id;
// }

CustomItemKGCartSchema.statics.addCustomKGBulkItemInCart = async (customKGItemDocItemsDoc, customKGBulkItemsList) => {
    const customKGItemDocument = customKGItemDocItemsDoc;
    customKGItemDocument.customKGItemList = customKGBulkItemsList;
    const updatedCustomKGBulkItemDetails = await customKGItemDocument.save();

    if (!updatedCustomKGBulkItemDetails) {
        throw new Error('ERROR_IN_CUSTOM_KG_BULK_ITEM_ADDITION');
    }

    return updatedCustomKGBulkItemDetails;
}

CustomItemKGCartSchema.statics.addCustomKGItemInCart = async (customKGItemDocItemsDoc, customKGItem) => {
    const customKGItemDocument = customKGItemDocItemsDoc;
    customKGItemDocument.customKGItemList = customKGItem;
    const updatedCustomKGItemDetails = await customKGItemDocument.save();

    if (!updatedCustomKGItemDetails) {
        throw new Error('ERROR_IN_CUSTOM_KG_ITEM_ADDITION');
    }

    return updatedCustomKGItemDetails;
}

CustomItemKGCartSchema.statics.clearCart = async (customKGItemDocItemsDoc) => {
    const customKGItemDocument = customKGItemDocItemsDoc;
    customKGItemDocument.customKGItemList = [];
    const updatedCustomKGItemDetails = await customKGItemDocument.save();

    if (!updatedCustomKGItemDetails) {
        throw new Error('ERROR_IN_CART_CLEARANCE');
    }

    return updatedCustomKGItemDetails;
}

const CustomItemKGCartModel = mongoose.model('CUSTOM_KG_ITEM_CART', CustomItemKGCartSchema, 'CUSTOM_KG_ITEM_CART');

module.exports = { CustomItemKGCartModel };
