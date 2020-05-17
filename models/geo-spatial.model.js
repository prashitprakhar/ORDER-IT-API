const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GeoSpatialSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: { 
            type: String,
            required: false,
            trim: true,
            default: 'Point' 
        },
        coordinates: []
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
});

GeoSpatialSchema.statics.updateCoordinates = async (doc, location) => {

    const userDoc = doc;

    userDoc.location.coordinates = location;

    userDoc.updatedAt = new Date();

    const updatedDoc = await userDoc.save();

    if(!updatedDoc) {
        throw new Error('LOCATION_UPDATE_FAILURE');
    }

    return updatedDoc;
}

GeoSpatialSchema.index({ location: "2dsphere" });

const GeoSpatialModel = mongoose.model('USER_GEO_SPATIAL_DETAILS', GeoSpatialSchema, 'USER_GEO_SPATIAL_DETAILS');

module.exports = { GeoSpatialModel };

// username: "SexySkeletor",
//   text: "Hello World",
//   location: {
//    type: "Point",
//    coordinates: [36.098948, -112.110492]
//   },