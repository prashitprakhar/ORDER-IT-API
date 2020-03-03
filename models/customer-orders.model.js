/*
export interface IUserFinalOrder {
    orderId: string;
    shopId: string;
    shopName: string;
    ordersList: Array<ICustomOrderItem>;
    selectedItemsTotalPrice: number;
    customItemsEstimatedPrice: number;
    estimatedDeliveryTime: string;
    estimatedDeliveryDateTimeFull: string;
    deliveryAddress: ICustomerAddress;
    deliveryDate: Date;
    deliveryTimeSlot: string;
    deliveryCharge: string;
    maxDistance: string;
    orderPlaced: boolean;
    orderStatus: string;
    orderConfirmationStatus: string;
}
*/

const mongoose = require('mongoose');
// const validator = require('validator');

const Schema = mongoose.Schema;

const CustomerOrdersSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
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
        type: Number,
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
        type: Number,
        required: true,
        trim: true
    },
    deliveryDate: {
        type: Date,
        required: true,
        trim: true
    },
    deliveryTimeSlot: {
        type: Number,
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
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        trim: true
    },
    orderConfirmationStatus: {
        type: String,
        required: true,
        trim: true
    },
    ordersList: [{
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
            type: Number,
            trim: true
        }
    }],
    deliveryAddress: {
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
        },
        isCurrentlyUsed: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
});

const CustomerOrdersModel = mongoose.model('CUSTOMER_ORDERS', CustomerOrdersSchema, 'CUSTOMER_ORDERS');

module.exports = { CustomerOrdersModel };

