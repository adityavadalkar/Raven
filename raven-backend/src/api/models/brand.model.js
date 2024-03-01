const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Brand Schema
 * @private
 */
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String },
  image: { type: String },
});

/**
 * Statics
 */
brandSchema.statics = {
  /**
   * Get brand
   *
   * @param {ObjectId} id - The objectId of brand.
   * @returns {Promise<Brand, APIError>}
   * @throws {APIError} - If brand does not exist.
   */
  async get(id) {
    let brand;

    if (mongoose.Types.ObjectId.isValid(id)) {
      brand = await this.findById(id).exec();
    }
    if (brand) {
      return brand;
    }

    throw new APIError({
      message: 'Brand does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List all brands
   * @return {Promise<Brand[]>}
   * @throws {APIError}
   */
  async list({ page, perPage }) {
    const brands = await this.find()
      .skip(perPage * (page - 1))
      .limit(parseInt(perPage, 10))
      .exec();
    return brands;
  },
};

module.exports = mongoose.model('Brand', brandSchema);
