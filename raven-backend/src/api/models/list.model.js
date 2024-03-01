const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const ListItem = require('./listItem.model');

const { Schema } = mongoose;

/**
 * List Schema
 * @private
 * @param {string} name - The name of the list.
 * @param {string} userId - The user who created the list.
 * @param {string} items - The items in the list.
 * @param {string} createdAt - The time the list was created.
 * @param {string} updatedAt - The time the list was last updated.
 */
const listSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true },
);

// Define a unique index on name and userId
listSchema.index({ name: 1, userId: 1 }, { unique: true });

/**
 * Statics
 * @static
 * @param {ObjectId} id - The objectId of list.
 * @returns {Promise<List, APIError>}
 * @throws {APIError} - If list does not exist.
 */
listSchema.statics = {
  async get(userId, listId, page = -1, perPage = -1) {
    let list;

    // get list by userId and listId
    if (mongoose.Types.ObjectId.isValid(listId)) {
      list = await this.findOne({ _id: listId, userId }).exec();
    }
    if (list) {
      if (page === -1 && perPage === -1) {
        return list;
      }
      // populate items
      const items = await ListItem.list({ listId }, { page, perPage });
      return { ...list.toObject(), items };
    }

    throw new APIError({
      message: 'List does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List lists in descending order of 'updatedAt' timestamp.
   * @param {number} skip - Number of lists to be skipped.
   * @param {number} limit - Limit number of lists to be returned.
   * @returns {Promise<List[]>}
   * @throws {APIError} - If list does not exist.
   */
  async list(query, { page = 1, perPage = 4 }) {
    const productLimit = 4;
    const lists = await this.aggregate([
      { $match: query },
      { $sort: { updatedAt: -1 } },
      { $skip: parseInt(perPage * (page - 1), 10) },
      { $limit: parseInt(perPage, 10) },
      {
        $lookup: {
          from: 'listitems',
          let: { listId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$listId', '$$listId'] } } },
            {
              $lookup: {
                from: 'products',
                let: { productId: '$productId' },
                pipeline: [
                  { $match: { $expr: { $eq: ['$_id', '$$productId'] } } },
                  { $project: { _id: 1, name: 1, image: 1 } },
                  { $limit: productLimit },
                ],
                as: 'product',
              },
            },
            { $unwind: '$product' },
            { $replaceRoot: { newRoot: '$product' } },
          ],
          as: 'products',
        },
      },
      { $project: { items: 0 } },
    ]).exec();

    return lists;
  },

  /**
   * Delete list.
   * @param {String} userId - The user who created the list.
   * @param {ObjectId} id - The objectId of list.
   * @returns {Promise<APIError>}
   * @throws {APIError} - If list does not exist.
   */
  async delete(userId, listId) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const list = await this.findOneAndDelete(
        { _id: listId, userId },
        { session },
      );
      if (!list) {
        throw new APIError({
          message: 'List does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      await ListItem.deleteMany({ listId }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  /**
   * Check if list name is taken.
   * if error is a mongoose duplicate key error
   * return a more meaningful error message
   * @param {error} error - The error object.
   * @returns {Promise<APIError>}
   * @throws {APIError} - If list does not exist.
   */
  checkDuplicateName(error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return new APIError({
        message: 'List name already taken',
        status: httpStatus.CONFLICT,
      });
    }
    return error;
  },
};

module.exports = mongoose.model('List', listSchema);
