const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/ORDER_IT_DB', { useFindAndModify: false, autoIndex: false });
// mongoose.connect('mongodb://indilligence123:indilligence123@ds243317.mlab.com:43317/indilligencedb');
mongoose.connect('mongodb://orderitservices:orderitservices123@ds043942.mlab.com:43942/order_it_db', { useFindAndModify: false });

module.exports = { mongoose };

/*
** To run mongoDB in local
** cd ~/
** Got to the directory where we see Users Directory
** Users/prashitprakhar/mongo/bin/mongod --dbpath=/Users/prashitprakhar/mongo-data
** From that location only, run ---
** Users/prashitprakhar/mongo/bin/mongo
*/