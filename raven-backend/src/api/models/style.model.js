const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Style Schema
 * @private
 */
const styleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  rules: {
    type: Object,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

/**
 * Statics
 * @public
 */
styleSchema.statics = {
  /**
   * Get style
   * @param {ObjectId} styleId - The objectId of style.
   * @returns {Promise<Style, APIError>}
   */
  async get(styleId) {
    let style;

    if (mongoose.Types.ObjectId.isValid(styleId)) {
      style = await this.findById(styleId).exec();
    }
    if (style) {
      return style;
    }

    throw new APIError({
      message: 'Style does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List all styles
   * @return {Promise<Style[]>}
   */
  async list(page, perPage, rules) {
    const styles = await this.find({}, { rules: rules === true ? 1 : 0 })
      .skip(perPage * (page - 1))
      .limit(parseInt(perPage, 10))
      .exec();
    return styles;
  },

  /**
   * Delete style
   * @param {ObjectId} styleId - The objectId of style.
   * @returns {Promise<Style, APIError>}
   */
  async delete(styleId) {
    let style;

    if (mongoose.Types.ObjectId.isValid(styleId)) {
      style = await this.findOneAndDelete({ styleId }).exec();
    }
    if (style) {
      return style;
    }

    throw new APIError({
      message: 'Style does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
};

/**
 * @typedef Style
 */
module.exports = mongoose.model('Style', styleSchema);
