const Review = require('../models/review');
const Tourism = require('../models/tourism')


module.exports.createNewReview = async (req, res) => {
    const { id } = req.params;
    const tourism = await Tourism.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    tourism.reviews.push(review)
    await review.save()
    await tourism.save()
    req.flash('success', "Succesfully added new review!")
    res.redirect(`/tourisms/${id}`)
}

module.exports.deleteReview = async (req, res, next) => {

    const { id, reviewId } = req.params
    const review = await Review.findByIdAndDelete(reviewId)
    const tourism = await Tourism.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    req.flash('success', "Succesfully deleted review!")
    res.redirect(`/tourisms/${id}`)
}