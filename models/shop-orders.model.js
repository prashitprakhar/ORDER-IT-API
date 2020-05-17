const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema({
    addressCategory: {
        type: String,
        trim: true,
        required: true
    },
    houseNumber: {
        type: String,
        required: true,
        trim: true
    },
    addressLineOne: {
        type: String,
        required: true,
        trim: true
    },
    addressLineTwo: {
        type: String,
        trim: true
    },
    pincode: {
        type: Number,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: Number,
        required: true,
        trim: true
    }
}, { _id: false });

const OrderedItemsSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        trim: true
    },
    shopId: {
        type: String,
        required: true,
        trim: true
    },
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    itemCount: {
        type: Number,
        required: true,
        trim: true
    },
    itemUnit: {
        type: String,
        required: true,
        trim: true
    },
    totalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    itemDiscountedRate: {
        type: Number,
        required: true,
        trim: true
    },
    itemWeight: {
        type: Number,
        required: true,
        trim: true
    },
    orderType: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        trim: true
    }
});

const OrderDetailsSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        trim: true
    },
    shopId: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        trim: true
    },
    selectedItemsTotalPrice: {
        type: Number,
        required: true,
        trim: true
    },
    customItemsEstimatedPrice: {
        type: Number,
        required: true,
        trim: true
    },
    estimatedDeliveryTime: {
        type: String,
        required: true,
        trim: true
    },
    estimatedDeliveryDateTimeFull: {
        type: String,
        required: true,
        trim: true
    },
    deliveryDate: {
        type: Date,
        required: true,
        trim: true
    },
    deliveryTimeSlot: {
        type: String,
        required: true,
        trim: true
    },
    deliveryCharge: {
        type: String,
        required: true,
        trim: true
    },
    orderPlaced: {
        type: Boolean,
        required: true,
        default: true
    },
    orderStatus: {
        type: String,
        required: true,
        trim: true
    },
    orderConfirmationStatus: {
        type: String,
        required: true,
        trim: true,
        default: "CONFIRMED"
    },
    maxDistance: {
        type: String,
        required: true,
        trim: true,
    },
    orderedItemsList: [OrderedItemsSchema],
    deliveryAddress: AddressSchema,
    paymentStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const ShopOrderDetailsSchema = new Schema({
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
    ordersList: [OrderDetailsSchema]
});

ShopOrderDetailsSchema.statics.updateOrder = async (newShopOrderDoc, currentOrderDetails) => {

    newShopOrderDoc.ordersList.push(currentOrderDetails);

    const updatedOrderDoc = await newShopOrderDoc.save();

    if (!updatedOrderDoc) {
        throw new Error('SHOP_ORDER_DB_UPDATE_FAILED');
    }
    return updatedOrderDoc;
}

ShopOrderDetailsSchema.statics.rollBackLastOrder = async (newShopOrderDoc, orderId) => {

    const shopOrderDoc = newShopOrderDoc;

    const rolledBackShopOrderDoc = shopOrderDoc.ordersList.filter(element => element.orderId !== orderId);

    shopOrderDoc.ordersList = rolledBackShopOrderDoc;

    const rolledBackShopOrderDocSaved = await shopOrderDoc.save();

    if(!rolledBackShopOrderDocSaved) {
        throw new Error('ORDER_ROLLBACK_FAILURE');
    }

    return rolledBackShopOrderDocSaved;
}

ShopOrderDetailsSchema.statics.updateOrderStatus = async (shopDoc, orderId, status) => {
    const nonCurrentOrderDoc = shopDoc.ordersList.filter(element => element.orderId !== orderId);
    let currentOrderDoc = shopDoc.ordersList.filter(element => element.orderId === orderId);
    currentOrderDoc[0].orderStatus = status;
    currentOrderDoc[0].updatedAt = new Date()

    const finalOrdersListDoc = [...nonCurrentOrderDoc, ...currentOrderDoc];

    shopDoc.ordersList = finalOrdersListDoc;

    const shopDocUpdatedFinal = await shopDoc.save();

    if(!shopDocUpdatedFinal) {
        throw new Error('ORDER_STATUS_UPDATE_FAILURE')
    }

    return shopDocUpdatedFinal;
}

ShopOrderDetailsSchema.statics.updatePaymentStatus = async (shopDoc, orderId, status) => {
    const nonCurrentOrderDoc = shopDoc.ordersList.filter(element => element.orderId !== orderId);
    let currentOrderDoc = shopDoc.ordersList.filter(element => element.orderId === orderId);
    currentOrderDoc[0].paymentStatus = status;
    currentOrderDoc[0].updatedAt = new Date()

    const finalOrdersListDoc = [...nonCurrentOrderDoc, ...currentOrderDoc];

    shopDoc.ordersList = finalOrdersListDoc;

    const shopDocUpdatedFinal = await shopDoc.save();

    if(!shopDocUpdatedFinal) {
        throw new Error('PAYMENT_STATUS_UPDATE_FAILURE')
    }

    return shopDocUpdatedFinal;
}

const ShopOrderDetailsModel = mongoose.model('SHOP_ORDERS_DETAILS_LIST', ShopOrderDetailsSchema, 'SHOP_ORDERS_DETAILS_LIST');

module.exports = { ShopOrderDetailsModel };