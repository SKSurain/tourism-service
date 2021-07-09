require('dotenv').config();
const express = require('express')
const catchAsync = require('./utils/CatchAsync')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')

const path = require('path')
const mongoose = require('mongoose');
const Joi = require('joi')
const Review = require('./models/review');
const { resourceUsage } = require('process');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { STATUS_CODES } = require('http');
const tourismRoutes = require('./routes/tourisms')
const usersRoutes = require('./routes/users')
const reviewsRoutes = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const session = require('express-session');
const MongoDBStore = require('connect-mongo')
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/tourism-service'
const dbUrl = 'mongodb://localhost:27017/tourism-service'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(mongoSanitize())

const secret = process.env.SECRET || 'bigCR8T'

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log('Session store error', e)
})

const sessionConfig = {
    store,
    name: 'sesh',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/tourisms/:id/reviews', reviewsRoutes)
app.use('/tourisms', tourismRoutes)
app.use('/', usersRoutes)
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})


