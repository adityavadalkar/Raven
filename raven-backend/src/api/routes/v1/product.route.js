const express = require('express');
const controller = require('../../controllers/product.controller');
const { checkJwt, checkAdminPermission } = require('../../middlewares/auth');

const router = express.Router();

router.route('/filters').get(controller.getFilters);

router
  .route('/')
  .get(checkJwt, checkAdminPermission, controller.listProducts)
  .post(checkJwt, checkAdminPermission, controller.createProduct);

router
  .route('/:productId')
  .get(controller.getProduct)
  .patch(checkJwt, checkAdminPermission, controller.updateProduct)
  .delete(checkJwt, checkAdminPermission, controller.deleteProduct);

router.route('/:productId/similar').post(controller.similarItems);
router.route('/:productId/another').get(controller.anotherItem);

module.exports = router;
