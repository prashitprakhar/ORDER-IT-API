const { MobileDetailsModel } = require('./../models/mobile-details.model');

exports.SAVE_MOBILE_DETAILS = async (req, res) => {
    const userId = req.body.userId;
    const fcmToken = req.body.fcmToken;

    let userMobileDetails = new MobileDetailsModel({
        userId: userId,
        fcmToken: fcmToken
    });

    try {
        let userMobileDetailsDoc = await MobileDetailsModel.findOne({ userId: userId });
        if (!userMobileDetailsDoc) {
            const userMobileDetailsNewDoc = await userMobileDetails.save();
            if (!userMobileDetailsNewDoc) {
                throw new Error('MOBILE_DETAILS_SAVE_FAILURE');
            }
            res.status(201).json({message: 'SUCCESS'});
        } else {
            userMobileDetailsDoc.fcmToken = fcmToken;
            const updatedUserMobileDoc = await userMobileDetailsDoc.save();
            if (!updatedUserMobileDoc) {
                throw new Error('MOBILE_DETAILS_UPDATE_FAILURE');
            }
            res.status(201).json({message: 'SUCCESS'});
        }
        // res.status(201).send();
    }
    catch (e) {
        res.status(400).send(e.toString())
    }
}