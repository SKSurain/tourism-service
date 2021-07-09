const Tourism = require("./models/tourism");

const Review = require('./models/review')
const { reviewSchema, tourismSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please sign in to continue')
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const tourism = await Tourism.findById(id)
    if (!tourism.author.equals(req.user.id)) {
        req.flash('error', 'You do not have permission to execute this action.')
        return res.redirect(`/tourisms/${id}`)
    }
    next();
}

module.exports.validateTourism = (req, res, next) => {
    const { error } = tourismSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to execute this action.')
        return res.redirect(`/tourisms/${id}`)
    }
    next()
}