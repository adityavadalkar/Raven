const httpStatus = require('http-status');
const Product = require('../models/product.model');
const APIError = require('../errors/api-error');

/**
 * Get product
 * @public
 */
exports.getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const products = await Product.getProduct(productId);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 * @public
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(httpStatus.CREATED).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing product
 * @public
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.getProduct(productId);
    const updatedProduct = Object.assign(product, req.body);
    await updatedProduct.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * @public
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await Product.deleteProduct(productId);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get product list
 * @public
 */
exports.listProducts = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const products = await Product.list({ page, perPage });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get filter options
 * @public
 */
exports.getFilters = async (req, res, next) => {
  try {
    const filterOptions = await Product.getAllFilterOptions();
    res.json(filterOptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Get customized products
 * @public
 */
exports.similarItems = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page, perPage } = req.query;
    const { filter } = req.body;

    const similarProducts = await Product.getSimilar(productId, filter, {
      page,
      perPage,
    });

    if (similarProducts.length === 0) {
      throw new APIError({
        message: 'No similar products found',
        status: httpStatus.NOT_FOUND,
      });
    }

    res.json(similarProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Get another product
 * @public
 */
exports.anotherItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { category } = req.query;

    const another = await Product.getAnother(productId, category);
    res.json(another);
  } catch (error) {
    next(error);
  }
};
