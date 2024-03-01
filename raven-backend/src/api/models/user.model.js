const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const List = require('./list.model');
const ListItem = require('./listItem.model');

/**
 * User Roles
 */
const roles = ['user', 'admin', 'guest'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    lastName: {
      type: String,
      maxlength: 128,
      trim: true,
    },
    userName: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    surveyCompleted: {
      type: Boolean,
      default: false,
    },
    picture: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
    },
    location: {
      name: { type: String },
      placeId: { type: String },
    },
    dateOfBirth: {
      type: Date,
    },
    budget: {
      // by default budget min is set to 0
      // and max is set to 10000
      tops: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      outerwear: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      bottoms: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      footwear: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      suit: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
      accessories: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 10000 },
      },
    },
    brands: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      '_id',
      'userId',
      'firstName',
      'lastName',
      'userName',
      'surveyCompleted',
      'picture',
      'gender',
      'dataOfBirth',
      'location',
      'budget',
      'brands',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
userSchema.statics = {
  roles,

  /**
   * Get user
   * @param {String} userId - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(userId) {
    const user = await this.findOne({ userId }).exec();
    if (user) {
      return user;
    }

    throw new APIError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },

  /**
   * Create new user
   * @param {String} userId - The Auth0 Id of user.
   * @param {Object} userBody - The object of user.
   * @returns {Promise<User, APIError>}
   */
  async createUser(userId, userBody) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const opts = { session, new: true };
      const user = await this.create([{ userId, ...userBody }], opts);
      await List.create([{ userId, name: 'DefaultLiked' }], opts);
      await session.commitTransaction();
      return user[0];
    } catch (error) {
      await session.abortTransaction();
      throw this.checkDuplicateUserId(error);
    } finally {
      await session.endSession();
    }
  },

  /**
   * Delete user
   * @param {String} userId - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async deleteUser(userId) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const user = await this.findOneAndDelete({ userId }, { session });
      if (!user) {
        throw new APIError({
          message: 'User does not exist',
          status: httpStatus.NOT_FOUND,
        });
      }
      await List.deleteMany({ userId }, { session });
      await ListItem.deleteMany({ userId }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  /**
   * Handle userId duplicate error
   * @param {Error} error - The error object.
   * @returns {Promise<APIError>}
   */
  checkDuplicateUserId(error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [
          {
            field: 'userId',
            location: 'body',
            messages: ['userId already exists'],
          },
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);
