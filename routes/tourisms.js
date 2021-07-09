const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/CatchAsync')
const { isLoggedIn, isAuthor, validateTourism } = require('../middleware')
const tourismCtr = require('../controllers/tourisms')

router.route('/')
    .get(catchAsync(tourismCtr.index))
    .post(isLoggedIn, validateTourism, catchAsync(tourismCtr.createTourism))

router.get('/new', isLoggedIn, tourismCtr.renderNewForm)

router.route('/:id')
    .get(catchAsync(tourismCtr.showTourism))
    .put(isLoggedIn, isAuthor, validateTourism, catchAsync(tourismCtr.editTourism))
    .delete(isLoggedIn, isAuthor, catchAsync(tourismCtr.deleteTourism))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(tourismCtr.renderEditForm))

module.exports = router;