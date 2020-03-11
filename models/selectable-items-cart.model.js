const mongoose = require('mongoose');
// const validator = require('validator');

const Schema = mongoose.Schema;

const SelectableItemCartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    selectableItemsList: [{
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

SelectableItemCartSchema.statics.addBulkSelectableItemInCart = async (selectableItemsDoc, bulkSelectableItem) => {
    const selectableItemDocument = selectableItemsDoc;
    selectableItemDocument.selectableItemsList = bulkSelectableItem;
    const updatedSelectedItemDetails = await selectableItemDocument.save();

    if (!updatedSelectedItemDetails) {
        throw new Error('ERROR_IN_BULK_SELECTABLE_ITEM_ADDITION');
    }

    return updatedSelectedItemDetails;
}

SelectableItemCartSchema.statics.addSelectableItemInCart = async (selectableItemsDoc, selectableItem) => {
    const selectableItemDocument = selectableItemsDoc;
    selectableItemDocument.selectableItemsList = selectableItem;
    const updatedSelectedItemDetails = await selectableItemDocument.save();

    if (!updatedSelectedItemDetails) {
        throw new Error('ERROR_IN_SELECTABLE_ITEM_ADDITION');
    }

    return updatedSelectedItemDetails;
}

SelectableItemCartSchema.statics.clearCart = async (selectableItemDoc) => {
    const selectableItemDocument = selectableItemDoc;
    selectableItemDocument.selectableItemsList = [];
    const updatedSelectedItemDetails = await selectableItemDocument.save();

    if (!updatedSelectedItemDetails) {
        throw new Error('ERROR_IN_CART_CLEARANCE');
    }

    return updatedSelectedItemDetails;
}

const SelectableItemCartModel = mongoose.model('SELECTABLE_ITEM_CART', SelectableItemCartSchema, 'SELECTABLE_ITEM_CART');

module.exports = { SelectableItemCartModel };

