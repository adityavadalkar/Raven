// external api controller
// Path: src/api/controllers/externalapi.controller.js
const axios = require('axios');
const config = require('../../config/vars');

/**
 * Get google place autocomplete
 * @public
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - next middleware
 * @returns {Promise<Object>}
 */
exports.placeAutocomplete = async (req, res, next) => {
  try {
    const { input } = req.query;
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${config.googleApiKey}`,
    );
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};
