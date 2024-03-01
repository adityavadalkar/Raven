const httpStatus = require('http-status');
const User = require('../models/user.model');
const Event = require('../models/event.model');

/**
 * Get user
 * @public
 */
exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.get(userId);
    res.json(user.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Create new user
 * @public
 */
exports.createUser = async (req, res, next) => {
  try {
    const userId = req.auth.payload.sub;
    const user = await User.createUser(userId, req.body);
    res.status(httpStatus.CREATED);
    res.json(user.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Edit user profile
 * @public
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let user = await User.get(userId);
    user = Object.assign(user, req.body);
    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.deleteUser(userId);
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Event tracking
 * @public
 */
exports.eventTrack = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.get(userId);
    const event = new Event(req.body);
    event.userId = user._id;
    const savedEvent = await event.save();
    res.status(httpStatus.CREATED);
    res.json(savedEvent);
  } catch (error) {
    next(error);
  }
};
