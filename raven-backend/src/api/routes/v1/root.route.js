const express = require('express');
const controller = require('../../controllers/externalapi.controller');
const { checkJwt } = require('../../middlewares/auth');

const router = express.Router();

router.route('/placeAutocomplete').get(checkJwt, controller.placeAutocomplete);

module.exports = router;
