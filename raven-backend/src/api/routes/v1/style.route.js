const express = require('express');
const controller = require('../../controllers/style.controller');
const { checkJwt, checkAdminPermission } = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(controller.listStyles)
  .post(checkJwt, checkAdminPermission, controller.createStyle);

router
  .route('/:styleId')
  .get(controller.getStyle)
  .patch(checkJwt, checkAdminPermission, controller.updateStyle)
  .delete(checkJwt, checkAdminPermission, controller.deleteStyle);

router.route('/:styleId/outfit').post(controller.getOutfit);

module.exports = router;
