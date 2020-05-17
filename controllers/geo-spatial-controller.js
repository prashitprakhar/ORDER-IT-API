const { GeoSpatialModel } = require('../models/geo-spatial.model');

exports.SAVE_GEO_SPATIAL_DETAILS = async (req, res) => {
    const userId = req.body.userId;
    const userType = req.body.userType;
    const location = req.body.coordinates;

    try {

        const doc = await GeoSpatialModel.findOne({ userId })

        if (doc) {
            const updatedDoc = await doc.updateCoordinates(doc, location);

            res.status(201).send(updatedDoc);

        } else {
           const newLocationData = new GeoSpatialModel({
            userId: userId,
            userType: userType,
            location: {
                coordinates: location
            }
           })
            const createdLocationDoc = await newLocationData.save();

            res.status(201).send(createdLocationDoc);
        }

    } catch (e) {
        res.status(401).send(e.toString())
    }
}

exports.CHECK_GEO_SPATIAL_DETAILS = async(req, res) => {
    const userId = req.body.userId;

    try {
        const doc = await GeoSpatialModel.findOne({ userId });

        res.status(201).send(doc);
        
    }
    catch (e) {
        res.status(400).send(e.toString());
    }
}