const httpStatus = require('http-status');
const List = require('../models/list.model');
const ListItem = require('../models/listItem.model');
const APIError = require('../errors/api-error');

/**
 * Get lists from user with pagination
 * @public
 */
exports.getAllLists = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const lists = await List.list(
      { userId: req.auth.payload.sub },
      { page, perPage },
    );
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

/**
 * Create list
 * @public
 */
exports.createList = async (req, res, next) => {
  const session = await List.startSession();
  try {
    const { name, products } = req.body;
    const userId = req.auth.payload.sub;

    // check duplicate in products
    const duplicate = products.some(
      (item, index) => products.indexOf(item) !== index,
    );
    if (duplicate) {
      throw new APIError({
        message: 'Duplicate products',
        status: httpStatus.BAD_REQUEST,
      });
    }

    session.startTransaction();
    const list = new List({ name, userId });
    const savedList = await list.save();

    const savedListItemPromises = products.map((productId) => {
      const listItem = new ListItem({
        userId,
        listId: savedList._id,
        productId,
      });
      return listItem.save();
    });

    const savedListItems = await Promise.all(savedListItemPromises);
    const listItems = savedListItems.map((savedListItem) => savedListItem._id);
    savedList.items = listItems;
    await savedList.save();
    await session.commitTransaction();

    // populate list items
    const populatedList = await List.get(userId, savedList._id, {
      page: 1,
      perPage: 1,
    });

    populatedList.products = [];
    if (populatedList.items.length !== 0) {
      for (let i = 0; i < populatedList.items.length; i += 1) {
        populatedList.products.push(populatedList.items[i].product);
      }
    }
    delete populatedList.items;

    res.status(httpStatus.CREATED);
    res.json(populatedList);
  } catch (error) {
    await session.abortTransaction();
    next(List.checkDuplicateName(error));
  } finally {
    await session.endSession();
  }
};

/**
 * Get list with pagination
 * @public
 */
exports.getList = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const list = await List.get(
      req.auth.payload.sub,
      req.params.listId,
      page,
      perPage,
    );
    res.json(list);
  } catch (error) {
    next(error);
  }
};

/**
 * Edit list
 * @public
 */
exports.editList = async (req, res, next) => {
  try {
    const { name } = req.body;
    const list = await List.get(req.auth.payload.sub, req.params.listId);
    list.name = name;
    const savedList = await list.save();
    res.json(savedList);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete list
 * @public
 */
exports.deleteList = async (req, res, next) => {
  try {
    const userId = req.auth.payload.sub;
    await List.delete(userId, req.params.listId);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Get list items with pagination
 * @public
 */
exports.getListItem = async (req, res, next) => {
  try {
    const { page, perPage } = req.query;
    const listItems = await ListItem.list(
      { listId: req.params.listId, userId: req.auth.payload.sub },
      { page, perPage },
    );
    res.json(listItems);
  } catch (error) {
    next(error);
  }
};

/**
 * Add list items
 * @public
 */
exports.addListItem = async (req, res, next) => {
  try {
    const userId = req.auth.payload.sub;
    const { listId } = req.params;
    const { product } = req.body;

    // check duplicate product
    const duplicate = await ListItem.findOne({
      userId,
      listId,
      productId: product,
    }).exec();
    if (duplicate) {
      throw new APIError({
        message: 'Duplicate product',
        status: httpStatus.BAD_REQUEST,
      });
    }

    const list = await List.get(userId, listId);

    const listItem = new ListItem({
      userId,
      listId,
      productId: product,
    });
    const savedListItem = await listItem.save();

    list.items.push(savedListItem._id);
    const savedList = await list.save();
    res.status(httpStatus.CREATED);
    res.json(savedList);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove list items
 * @public
 */
exports.removeListItems = async (req, res, next) => {
  const session = await List.startSession();
  try {
    const userId = req.auth.payload.sub;
    const { listId } = req.params;
    const { itemId } = req.params;

    const list = await List.get(userId, listId);
    const index = list.items.indexOf(itemId);
    if (index > -1) {
      list.items.splice(index, 1);
    } else {
      throw new APIError({
        message: 'List item does not exist',
        status: httpStatus.NOT_FOUND,
      });
    }

    console.log('im here');

    session.startTransaction();
    await ListItem.deleteOne({ userId, listId, _id: itemId }, { session });
    await list.save();
    await session.commitTransaction();

    res.json(list);
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      await session.abortTransaction();
      next(error);
    }
  } finally {
    await session.endSession();
  }
};
