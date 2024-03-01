const express = require('express');
const rootRoutes = require('./root.route');
const productRoutes = require('./product.route');
const userRoutes = require('./user.route');
const listRoutes = require('./list.route');
const styleRoutes = require('./style.route');
const brandRoutes = require('./brand.route');

const router = express.Router();

/**
 * GET v1/heartbeat
 */
router.get('/heartbeat', (req, res) => res.send('heartbeat'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

/**
 * APIs
 */
router.use('/', rootRoutes);
router.use('/products', productRoutes);
router.use('/styles', styleRoutes);
router.use('/brands', brandRoutes);
router.use('/user', userRoutes);
router.use('/list', listRoutes);

module.exports = router;
