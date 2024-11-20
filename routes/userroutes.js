const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// POST /auth/signup
router.post('/auth/signup', userController.signUp);

// POST /auth/login
router.post('/auth/login', userController.login);

// POST /auth/logout
router.post('/auth/logout', userController.logout);

router.post('/auth/coupons',userController.getCouponCode);
//router.get('/auth/coupons',userController.getUserCoupons);


router.get('/auth/coupons/:couponCode', userController.getUserCoupons);


router.post('/auth/bookings',userController.bookShow);

module.exports = router;