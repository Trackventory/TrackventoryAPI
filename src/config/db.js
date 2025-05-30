const mongoose = require('mongoose');
require('dotenv/config');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database successfully');
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectToDB;