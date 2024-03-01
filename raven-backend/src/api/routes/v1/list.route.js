const express = require('express');
const controller = require('../../controllers/list.controller');
const { checkJwt } = require('../../middlewares/auth');

const router = express.Router();

// user's lists
router
  .route('/')
  .get(checkJwt, controller.getAllLists)
  .post(checkJwt, controller.createList);

router
  .route('/:listId')
  .get(checkJwt, controller.getList)
  .patch(checkJwt, controller.editList)
  .delete(checkJwt, controller.deleteList);

// list items
router
  .route('/:listId/item')
  .get(checkJwt, controller.getListItem)
  .post(checkJwt, controller.addListItem);

router
  .route('/:listId/item/:itemId')
  .delete(checkJwt, controller.removeListItems);

module.exports = router;
