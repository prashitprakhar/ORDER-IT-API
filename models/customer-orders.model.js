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
}, {_id: false});

const OrderedItemsSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        trim: true
    },
    // deliveryAddress: [addressSchema],
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
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const CustomerOrdersSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    ordersList: [OrderDetailsSchema]
});

CustomerOrdersSchema.statics.addNewOrder = async (customerOrdersDoc, currentOrderDetails) => {
    const existingOrdersDoc = customerOrdersDoc;

    let finalOrder = {};
    const addressDetails = {
        addressCategory: currentOrderDetails.deliveryAddress.addressCategory,
        houseNumber: currentOrderDetails.deliveryAddress.houseNumber,
        addressLineOne: currentOrderDetails.deliveryAddress.addressLineOne,
        addressLineTwo: currentOrderDetails.deliveryAddress.addressLineTwo,
        pincode: currentOrderDetails.deliveryAddress.pincode,
        city: currentOrderDetails.deliveryAddress.city,
        state: currentOrderDetails.deliveryAddress.state,
        mobileNumber: currentOrderDetails.deliveryAddress.mobileNumber
    }

    let ordersListUpdated = [];
    currentOrderDetails.orderedItemsList.forEach(element => {
        let itemDetails = {
            itemId: element.itemId,
            shopId: element.shopId,
            itemName: element.itemName,
            itemCount: element.itemCount,
            itemUnit: element.itemUnit,
            totalPrice: element.totalPrice,
            itemDiscountedRate: element.itemDiscountedRate,
            itemWeight: element.itemWeight,
            orderType: element.orderType,
            shopName: element.shopName
        }
        ordersListUpdated.push(itemDetails)
    });

    finalOrder.deliveryAddress = addressDetails;
    finalOrder.orderedItemsList = ordersListUpdated;

    finalOrder.orderId = currentOrderDetails.orderId;
    finalOrder.shopId = currentOrderDetails.shopId;
    finalOrder.shopName = currentOrderDetails.shopName;
    finalOrder.selectedItemsTotalPrice = currentOrderDetails.selectedItemsTotalPrice;
    finalOrder.customItemsEstimatedPrice = currentOrderDetails.customItemsEstimatedPrice;
    finalOrder.estimatedDeliveryTime = currentOrderDetails.estimatedDeliveryTime;
    finalOrder.estimatedDeliveryDateTimeFull = currentOrderDetails.estimatedDeliveryDateTimeFull;
    finalOrder.deliveryDate = currentOrderDetails.deliveryDate;
    finalOrder.deliveryTimeSlot = currentOrderDetails.deliveryTimeSlot;
    finalOrder.deliveryCharge = currentOrderDetails.deliveryCharge;
    finalOrder.orderPlaced = currentOrderDetails.orderPlaced;
    finalOrder.orderStatus = currentOrderDetails.orderStatus;
    finalOrder.orderConfirmationStatus = currentOrderDetails.orderConfirmationStatus;
    finalOrder.maxDistance = currentOrderDetails.maxDistance;

    existingOrdersDoc.ordersList.push(finalOrder)

    const orderPlacedDoc = await existingOrdersDoc.save()

    if(!orderPlacedDoc) {
        throw new Error('ORDER_PLACEMENT_FAILURE');
    }

    return orderPlacedDoc;

}

const CustomerOrdersModel = mongoose.model('CUSTOMER_ORDERS', CustomerOrdersSchema, 'CUSTOMER_ORDERS');

module.exports = { CustomerOrdersModel };
