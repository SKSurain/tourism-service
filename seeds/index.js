
const mongoose = require('mongoose');
const Tourism = require('../models/tourism')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected');
});

const randomGenerator = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Tourism.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomprice = Math.floor(Math.random() * 30);
        const camp = new Tourism({
            title: `${randomGenerator(descriptors)} ${randomGenerator(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero, numquam tenetur magnam molestiae repudiandae repellat ab ipsam ea fugit dolores, nulla dolor corrupti nobis quod cum est doloremque eveniet omnis.`,
            price: randomprice,
            author: '60dca6757a38160c2c732805'
        });

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})