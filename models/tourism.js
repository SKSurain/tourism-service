const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const TourismSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

TourismSchema.post('findOneAndDelete', async function (tourism) {
    if (tourism) {
        await Review.deleteMany({
            _id: {
                $in: tourism.reviews
            }
        })
    }
})

module.exports = mongoose.model('Tourism', TourismSchema);