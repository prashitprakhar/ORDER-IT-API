const mongoose = require('mongoose');
const validator = require('validator');


const Schema = mongoose.Schema;

const MobileDetailsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    fcmToken: {
        type: String,
        required: true,
        trim: true
    }
});

const MobileDetailsModel = mongoose.model('MOBILE_DETAILS', MobileDetailsSchema, 'MOBILE_DETAILS');

module.exports = { MobileDetailsModel };