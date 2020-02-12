const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'USER_LOGIN_DETAILS' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

const TokenModel = mongoose.model('USER_SIGNUP_VERIFICATION_TOKEN', TokenSchema, 'USER_SIGNUP_VERIFICATION_TOKEN');

module.exports = { TokenModel };