const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
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
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    securePIN: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    isVerified: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastLoggedInAt: {
        type: Date,
    required: true,
    default: Date.now
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//methods are instance specific
//Secret Message - @indilligenceisIntelligence+DiligenceWhichcreatesGeniuses&$
//secret Token - QGluZGlsbGlnZW5jZWlzSW50ZWxsaWdlbmNlK0RpbGlnZW5jZVdoaWNoY3JlYXRlc0dlbml1c2VzJiQ=
UserSchema.methods.generateAuthToken = async function () {
    const user = this //this gives control over the current user model
    // const loggedInAt = new Date();
    const token = jwt.sign({ _id: user._id.toString()}, 'QGluZGlsbGlnZW5jZWlzSW50ZWxsaWdlbmNlK0RpbGlnZW5jZVdoaWNoY3JlYXRlc0dlbml1c2VzJiQ=');
    user.tokens = user.tokens.concat({ token });
    user.lastLoggedInAt = new Date()
    await user.save();

    return token;
}

//This was the manual way of hiding private details
// UserSchema.methods.getPublicProfile = function() {
//     const user = this;

//     const userObject = user.toObject();

//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// }

//alternate way is manipulating the toJSON Function itself
UserSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

//For Login authentication
//statics are application specific
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Please check your email and password')
    }

    return user;
}

UserSchema.statics.findByEmailAndPin = async (email, securePIN) => {
    const user = await UserModel.findOne({ email });

    if(!user) {
        throw new Error('User not found');
    }

    const isSecurePINMatch = await bcrypt.compare(securePIN, user.securePIN)

    if(!isSecurePINMatch) {
        throw new Error('Please check your secure PIN and try again.');
    }

    return user;
}

UserSchema.statics.findByToken = async (token) => {
    const user = await UserModel.findOne({ token })

    if (!user) {
        throw new Error('User Not logged in.');
    }

    return user;
}


//Hash plain text password before saving
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
        user.securePIN = await bcrypt.hash(user.securePIN, 8);
    }

    next()
})

const UserModel = mongoose.model('USER_LOGIN_DETAILS', UserSchema, 'USER_LOGIN_DETAILS');

module.exports = { UserModel };

/* Sendgrid - email service
** username - indilligenceapp
** Password - Standard
*/
