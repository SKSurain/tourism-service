const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const userCtr = require('../controllers/users')

router.route('/register')
    .get(userCtr.renderRegisterForm)
    .post(catchAsync(userCtr.createNewUser))

router.route('/login')
    .get(userCtr.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(userCtr.loginUser))

router.get('/logout', userCtr.logout)

module.exports = router;