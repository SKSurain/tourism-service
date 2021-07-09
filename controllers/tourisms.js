const Tourism = require('../models/tourism');


module.exports.index = async (req, res) => {
    const tourisms = await Tourism.find({});
    res.render('tourisms/index', { tourisms })
}

module.exports.renderNewForm = (req, res) => {
    res.render('tourisms/new')
}

module.exports.createTourism = async (req, res, next) => {
    const newTourism = new Tourism(req.body.tourism);
    newTourism.author = req.user._id
    await newTourism.save();
    req.flash('success', 'Successfully made new tourism service!')
    res.redirect(`/tourisms/${newTourism._id}`)
}

module.exports.showTourism = async (req, res) => {
    const { id } = req.params;
    const tourism = await (await Tourism.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    if (!tourism) {
        req.flash('error', 'Sorry, that tourism service is unavailable.')
        return res.redirect('/tourisms')
    }
    res.render('tourisms/show', { tourism })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const tourism = await Tourism.findById(id)
    if (!tourism) {
        req.flash('error', 'Sorry, that tourism service is unavailable.')
        return res.redirect('/tourisms')
    }
    res.render('tourisms/edit', { tourism })
}

module.exports.editTourism = async (req, res) => {
    const { id } = req.params;
    const tourism = await Tourism.findByIdAndUpdate(id, { ...req.body.tourism })
    req.flash('success', 'Successfully updated tourism service!')
    res.redirect(`/tourisms/${tourism._id}`)
}

module.exports.deleteTourism = async (req, res) => {
    const { id } = req.params;
    const tourism = await Tourism.findByIdAndDelete(id);
    if (!tourism) {
        req.flash('error', 'Sorry, that tourism service is unavailable.')
        return res.redirect('/tourisms')
    }
    req.flash('success', 'Successfully deleted tourism service!')
    res.redirect(`/tourisms`);
}