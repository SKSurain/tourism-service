const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/CatchAsync')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')
const reviewCtr = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewCtr.createNewReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewCtr.deleteReview))

module.exports = router;