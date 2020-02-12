const express = require('express');
const router = new express.Router();
// const authentication = require('../middleware/authentication');
const PASSWORD_RESET_EMAIL_CONTROLLER = require('./../controllers/password-reset-email-controller');

router.get('/user/:email', PASSWORD_RESET_EMAIL_CONTROLLER.sendPasswordResetEmail);

router.post('/receive_new_password/:userId/:token', PASSWORD_RESET_EMAIL_CONTROLLER.receiveNewPassword);

module.exports = router;

