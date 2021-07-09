const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.createNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)

        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Succesfully registered!')
            res.redirect('/tourisms')
        })

    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/tourisms'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Succesfully logged out')
    res.redirect('/tourisms')
}