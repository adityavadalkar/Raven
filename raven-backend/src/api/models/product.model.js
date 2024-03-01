const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Product Schema
 * @private
 */
const productSchema = new mongoose.Schema({
  main_category: { type: String, required: true },
  sub_category: { type: String, required: true },
  brand: { type: String, required: true },
  product_name: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  on_sale: { type: Boolean, required: true },
  attributes: {
    product_type: { type: String },
    color_hue: { type: [{ type: String }], default: undefined },
    color_saturation: { type: Number },
    color_lightness: { type: Number },
    material: { type: [{ type: String }], default: undefined },
    pattern: { type: [{ type: String }], default: undefined },
    fit: { type: String },
    length: { type: String },
    upper_material: { type: [{ type: String }], default: undefined },
    onbody_length: { type: String },
    front_closure: { type: [{ type: String }], default: undefined },
    trouser_fit: { type: String },
    trouser_type: { type: String },
    stretchability: { type: String },
    wash_level: { type: String },
    fabric: { type: [{ type: String }], default: undefined },
    type: { type: String },
    rise: { type: String },
    jacket_fit: { type: String },
    neckline: { type: String },
    button_closure: { type: String },
    sleeve_length: { type: String },
    shape: { type: String },
    height: { type: String },
  },
});

/**
 * Statics
 */
productSchema.statics = {
  /**
   * Get product
   *
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  async getProduct(productId) {
    let product;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await this.findById(productId).exec();
    }
    if (product) {
      return product;
    }

    throw new APIError({
      message: 'Product does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Get another product
   *
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  async getAnother(id, category) {
    let product;

    // find another product from the same sub category, but not the same product
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await this.findOne({
        _id: { $ne: id },
        sub_category: category,
      }).exec();
    }
    if (product) {
      return product;
    }

    throw new APIError({
      message: 'Product does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * List products
   *
   * @param {number} skip - Number of products to be skipped.
   * @param {number} limit - Limit number of products to be returned.
   * @returns {Promise<Product[]>}
   */
  list({ page = 1, perPage = 8 }) {
    return this.find()
      .skip(perPage * (page - 1))
      .limit(parseInt(perPage, 10))
      .exec();
  },

  /**
   * Get one item
   *
   * @param {String} clothing_type
   * @param {String} style
   * @returns {Promise<Product[]>}
   */
  findProduct(query) {
    return this.aggregate([{ $match: query }, { $sample: { size: 1 } }]).exec();
  },

  /**
   * Get all filter options for each category
   * @returns {Promise<Product[]>}
   */
  async getAllFilterOptions() {
    const categories = await this.distinct('sub_category').exec();

    let filterOptions = await Promise.all(
      categories.map((category) => this.getFilterOptionsForCategory(category)),
    );
    filterOptions = filterOptions.reduce((acc, filterOption) => {
      acc[filterOption.sub_category] = filterOption;
      return acc;
    }, {});

    return filterOptions;
  },

  /**
   * Get filter options for one category
   * @returns {Promise<Product[]>}
   */
  async getFilterOptionsForCategory(category) {
    // find all the attributes of that category and create group
    const product = await this.findOne({ sub_category: category }).exec();
    if (!product) {
      throw new APIError({
        message: 'Category does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }

    // remove undefined attributes
    Object.keys(product.attributes).forEach((key) => {
      if (product.attributes[key] === undefined) {
        delete product.attributes[key];
      }
    });

    // group by attributes
    const attributesOptions = Object.keys(product.attributes).reduce(
      (acc, attribute) => {
        acc[attribute] = { $addToSet: `$attributes.${attribute}` };
        return acc;
      },
      {},
    );

    // project the attributes, if the value is an array, then flatten it
    const projectAttributes = Object.keys(product.attributes).reduce(
      (acc, attribute) => {
        if (Array.isArray(product.attributes[attribute])) {
          acc[attribute] = {
            $reduce: {
              input: `$${attribute}`,
              initialValue: [],
              in: { $setUnion: ['$$value', '$$this'] },
            },
          };
        } else {
          acc[attribute] = 1;
        }
        return acc;
      },
      {},
    );

    const filterOptions = await this.aggregate([
      { $match: { sub_category: category } },
      {
        $group: {
          _id: '$sub_category',
          ...attributesOptions,
        },
      },
      {
        $project: {
          _id: 0,
          sub_category: '$_id',
          ...projectAttributes,
        },
      },
    ]).exec();

    return filterOptions[0];
  },

  /**
   * Get similar products
   * @returns {Promise<Product[]>}
   */
  async getSimilar(productId, filter, { page = 1, perPage = 8 }) {
    const product = await this.getProduct(productId);
    if (!product) {
      throw new APIError({
        message: 'Product does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }

    // create filterCriteria based on the filter
    let filterCriteria = {};
    if (filter) {
      // add "attributes" prefix to all keys in filter
      filterCriteria = Object.keys(filter).reduce((acc, key) => {
        acc[`attributes.${key}`] = filter[key];
        return acc;
      }, {});
    }

    // create matchedFields based on the product
    let matchedFields = {};
    if (product.attributes) {
      matchedFields = Object.keys(product.attributes).reduce(
        (acc, key) => {
          if (product.attributes[key] === undefined) return acc;
          acc.$sum = [
            ...acc.$sum,
            {
              $cond: [
                {
                  $eq: [`$attributes.${key}`, product.attributes[key]],
                },
                1,
                0,
              ],
            },
          ];
          return acc;
        },
        { $sum: [] },
      );
    }

    const pipeline = [
      {
        $match: {
          // Exclude the given product from the search
          _id: { $ne: productId },
          sub_category: product.sub_category,
          ...filterCriteria,
        },
      },
      {
        $project: {
          matchedFields,
          // project all the other fields in product
          main_category: 1,
          sub_category: 1,
          product_name: 1,
          brand: 1,
          price: 1,
          link: 1,
          image: 1,
          on_sale: 1,
          attributes: 1,
        },
      },
      {
        $sort: { matchedFields: -1 },
      },
    ];

    const similarProducts = await this.aggregate(pipeline)
      .project({ matchedFields: 0 })
      .skip(perPage * (page - 1))
      .limit(parseInt(perPage, 10))
      .exec();

    return similarProducts;
  },

  /**
   * Delete product
   * @param {ObjectId} productId - The objectId of product.
   * @returns {Promise<Product, APIError>}
   */
  async deleteProduct(productId) {
    const product = await this.findOneAndDelete(productId).exec();
    if (product) {
      return product;
    }

    throw new APIError({
      message: 'Product does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
};

module.exports = mongoose.model('Product', productSchema);
