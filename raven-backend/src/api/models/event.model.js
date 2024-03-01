const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const { Schema } = mongoose;

/**
 * Event Schema
 * @private
 */
const eventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  userId: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId },
  reasons: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
});

/**
 * Statics
 */
eventSchema.statics = {
  /**
   * Get event
   * @param {ObjectId} id - The objectId of event.
   * @returns {Promise<Event, APIError>}
   */
  async get(id) {
    let event;

    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await this.findById(id).exec();
    }
    if (event) {
      return event;
    }

    throw new APIError({
      message: 'Event does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List events in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of events to be skipped.
   * @param {number} limit - Limit number of events to be returned.
   * @returns {Promise<Event[]>}
   */
  list({ page = 1, perPage = 5 }) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

module.exports = mongoose.model('Event', eventSchema);
