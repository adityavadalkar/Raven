const httpStatus = require('http-status');
const Brand = require('../models/brand.model');

/**
 * List brands
 * @public
 */
exports.listBrands = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const brands = await Brand.list({ page, perPage });
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

/**
 * Get brand
 * @public
 */
exports.getBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.get(brandId);
    res.json(brand.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create new brand
 * @public
 */
exports.createBrand = async (req, res, next) => {
  try {
    const brand = new Brand(req.body);
    const savedBrand = await brand.save();
    res.json(savedBrand);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit brand
 * @public
 */
exports.updateBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    let brand = await Brand.get(brandId);
    brand = Object.assign(brand, req.body);
    const savedBrand = await brand.save();
    res.json(savedBrand);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete brand
 * @public
 */
exports.deleteBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    await Brand.deleteBrand(brandId);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};
