const mongoose = require('mongoose');
// const validator = require('validator');

const Schema = mongoose.Schema;

const CustomItemPackCartSchema = new Schema({
    userId : {
        type: String,
        required: true,
        trim: true
    },
    customPackItemList: [{
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

CustomItemPackCartSchema.statics.addCustomPackBulkItemInCart = async (customPackItemDocItemsDoc, customPackBulkItemsList) => {
    const customPackItemDocument = customPackItemDocItemsDoc;
    customPackItemDocument.customPackItemList = customPackBulkItemsList;
    const updatedCustomPackBulkItemDetails = await customPackItemDocument.save();

    if (!updatedCustomPackBulkItemDetails) {
        throw new Error('ERROR_IN_CUSTOM_PACK_BULK_ITEM_ADDITION');
    }

    return updatedCustomPackBulkItemDetails;
}

CustomItemPackCartSchema.statics.addCustomPackItemInCart = async (customPackItemDocItemsDoc, customPackItem) => {
    const customPackItemDocument = customPackItemDocItemsDoc;
    // console.log("customPackItemDocItemsDoc customPackItemDocItemsDoc ---", customPackItemDocItemsDoc);
    customPackItemDocument.customPackItemList = customPackItem;
    const updatedCustomPackItemDetails = await customPackItemDocument.save();

    if (!updatedCustomPackItemDetails) {
        throw new Error('ERROR_IN_CUSTOM_PACK_ITEM_ADDITION');
    }

    return updatedCustomPackItemDetails;
}

CustomItemPackCartSchema.statics.clearCart = async (customPackItemDocItemsDoc) => {
    const customPackItemDocument = customPackItemDocItemsDoc;
    customPackItemDocument.customPackItemList = [];
    const updatedCustomPackItemDetails = await customPackItemDocument.save();

    if (!updatedCustomPackItemDetails) {
        throw new Error('ERROR_IN_CART_CLEARANCE');
    }

    return updatedCustomPackItemDetails;
}

const CustomItemPackCartModel = mongoose.model('CUSTOM_PACK_ITEM_CART', CustomItemPackCartSchema, 'CUSTOM_PACK_ITEM_CART');

module.exports = { CustomItemPackCartModel };
