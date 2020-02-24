const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user-model');

const authentication = async (req, res, next) => {

    try {
        console.log("Auth verification")
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'QGluZGlsbGlnZW5jZWlzSW50ZWxsaWdlbmNlK0RpbGlnZW5jZVdoaWNoY3JlYXRlc0dlbml1c2VzJiQ=')
        console.log("Decoded ID ",decoded)
        const user = await UserModel.findOne({ _id: decoded._id, 'tokens.token' : token })
        if(!user) {
            throw new Error()
        }
        console.log("*** user authd ***",user)
        req.user = user;
        req.token = token;
        next();
    }
    catch(e) {
        res.status(401).send({error : 'Unauthorized request.'})
    }
}

module.exports = authentication