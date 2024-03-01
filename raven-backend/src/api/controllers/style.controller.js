const httpStatus = require('http-status');
const Style = require('../models/style.model');
const Product = require('../models/product.model');
const APIError = require('../errors/api-error');

/**
 * List styles
 * @public
 */
exports.listStyles = async (req, res, next) => {
  try {
    const { page, perPage, rules } = req.query;
    const styles = await Style.list(page, perPage, rules === 'true');
    res.json(styles);
  } catch (error) {
    next(error);
  }
};

/**
 * Get style
 * @public
 */
exports.getStyle = async (req, res, next) => {
  try {
    const { styleId } = req.params;
    const style = await Style.get(styleId);
    res.json(style);
  } catch (error) {
    next(error);
  }
};

/**
 * Create new style
 * @public
 */
exports.createStyle = async (req, res, next) => {
  try {
    const style = new Style(req.body);
    const savedStyle = await style.save();
    res.json(savedStyle);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit style
 * @public
 */
exports.updateStyle = async (req, res, next) => {
  try {
    const { styleId } = req.params;
    let style = await Style.get(styleId);
    style = Object.assign(style, req.body);
    const savedStyle = await style.save();
    res.json(savedStyle);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete style
 * @public
 */
exports.deleteStyle = async (req, res, next) => {
  try {
    const { styleId } = req.params;
    await Style.deleteStyle(styleId);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get outfit
 * @public
 */
exports.getOutfit = async (req, res, next) => {
  try {
    const { budget } = req.body;
    const { styleId } = req.params;
    const style = await Style.get(styleId);
    if (style.rules.length === 0) {
      throw new APIError({
        message: 'Style does not have any rules',
        status: httpStatus.NOT_FOUND,
      });
    }

    const { rules } = style;
    const queries = generateOutfitQuery(rules, budget);

    const facetPromises = queries.map((query) => Product.findProduct(query));
    const queryResults = await Promise.all(facetPromises);

    const outfit = [];
    for (let i = 0; i < queryResults.length; i += 1) {
      if (queryResults[i].length === 0) {
        throw new APIError({
          message: `${rules[i].main_category} product not found`,
          status: httpStatus.NOT_FOUND,
        });
      } else {
        outfit.push(...queryResults[i]);
      }
    }

    res.json(outfit);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate outfit query
 * @private
 */
const generateOutfitQuery = (rules, budget) => {
  const queries = Object.keys(rules).map((key) => {
    const query = getQueryFromRule(rules[key]);
    const mainCategory = rules[key].main_category;
    if (budget && budget[mainCategory]) {
      const priceFilter = {};
      if (typeof budget[mainCategory].min !== 'undefined') {
        priceFilter.$gte = Number(budget[mainCategory].min);
      }
      if (typeof budget[mainCategory].max !== 'undefined') {
        priceFilter.$lte = Number(budget[mainCategory].max);
      }
      query.price = priceFilter;
    }
    return query;
  });
  return queries;

  // const queries = rules.map((rule) => {
  //   const query = getQueryFromRule(rule);
  //   const mainCategory = rule.main_category;
  //   if (budget && budget[mainCategory]) {
  //     const priceFilter = {};
  //     if (typeof budget[mainCategory].min !== 'undefined') {
  //       priceFilter.$gte = Number(budget[mainCategory].min);
  //     }
  //     if (typeof budget[mainCategory].max !== 'undefined') {
  //       priceFilter.$lte = Number(budget[mainCategory].max);
  //     }
  //     query.price = priceFilter;
  //   }
  //   return query;
  // });
  // return queries;
};

/**
 * Get outfitting query
 * @private
 */
const getQueryFromRule = (rules) => {
  const query = {};
  rules.map((rule) => {
    const orQuery = {};
    Object.keys(rule).forEach((key) => {
      if (key === 'main_category') {
        orQuery[key] = rule[key];
      } else if (key === 'sub_category') {
        orQuery[key] = { $in: rule[key] };
      } else {
        orQuery[`attributes.${key}`] = { $in: rule[key] };
      }
    });
    query.$or = query.$or || [];
    query.$or.push(orQuery);
    return orQuery;
  });
  return query;
};
