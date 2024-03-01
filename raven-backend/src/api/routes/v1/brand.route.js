const express = require('express');
const controller = require('../../controllers/brand.controller');
const { checkJwt, checkAdminPermission } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(controller.listBrands)
  .post(checkJwt, checkAdminPermission, controller.createBrand);

router
  .route('/:brandId')
  .get(controller.getBrand)
  .patch(checkJwt, checkAdminPermission, controller.updateBrand)
  .delete(checkJwt, checkAdminPermission, controller.deleteBrand);

module.exports = router;
