const express = require('express');
const controller = require('../../controllers/user.controller');
const { checkJwt, checkAdminPermission } = require('../../middlewares/auth');

const router = express.Router();

router.route('/').post(checkJwt, controller.createUser);

router
  .route('/:userId')
  .get(checkJwt, controller.getUser)
  .patch(checkJwt, controller.updateUser)
  .delete(checkJwt, checkAdminPermission, controller.deleteUser);

// user's events
router.route('/:userId/event').post(checkJwt, controller.eventTrack);

module.exports = router;
