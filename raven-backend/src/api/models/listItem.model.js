const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const Product = require('./product.model');

const { Schema } = mongoose;

/**
 * List Item Schema
 * @private
 * @param {string} userId - The user who created the list item.
 * @param {string} productId - The product in the list item.
 * @param {string} createdAt - The time the list item was created.
 * @param {string} updatedAt - The time the list item was last updated.
 */
const listItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    listId: { type: Schema.Types.ObjectId },
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  },
  { timestamps: true },
);

listItemSchema.statics = {
  /**
   * Get list item
   * @param {String} userId - The user who created the list item.
   * @param {ObjectId} listItemId - The objectId of list item.
   * @returns {Promise<ListItem, APIError>}
   * @throws {APIError} - If list item does not exist.
   */
  async get(userId, listItemId) {
    let listItem;

    if (mongoose.Types.ObjectId.isValid(listItemId)) {
      listItem = await this.findOne({ _id: listItemId, userId }).exec();
    }
    if (listItem) {
      // populate product
      const product = await Product.get(listItem.productId);
      return { ...listItem.toObject(), product };
    }

    throw new APIError({
      message: 'List item does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List list items in descending order of 'updatedAt' timestamp.
   * @param {number} skip - Number of list items to be skipped.
   * @param {number} limit - Limit number of list items to be returned.
   * @returns {Promise<ListItem[]>}
   * @throws {APIError} - If user does not exist.
   */
  async list(query, { page = 1, perPage = 4 }) {
    const listItems = await this.find(query)
      .populate({
        path: 'productId',
      })
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .then((items) => {
        // change productId field name to "product"
        const listItemsObject = items.map((listItem) => {
          const listItemObject = listItem.toObject();
          listItemObject.product = listItemObject.productId;
          delete listItemObject.productId;
          return listItemObject;
        });
        return listItemsObject;
      });

    return listItems;
  },
};

module.exports = mongoose.model('ListItem', listItemSchema);
