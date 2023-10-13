const mongoose = require('mongoose');

// connection to mongodb database based on local connection or production
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gibber");

module.exports = mongoose.connection;