const express = require('express');
const router = new express.Router();
const authentication = require('../middleware/authentication');
const GEO_SPATIAL_CONTROLLER = require('./../controllers/geo-spatial-controller');

router.post('/saveLocation', GEO_SPATIAL_CONTROLLER.SAVE_GEO_SPATIAL_DETAILS);

router.post('/checkLocationDetails', GEO_SPATIAL_CONTROLLER.CHECK_GEO_SPATIAL_DETAILS);

module.exports = router;