const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db-connections/mongoose-connection');
const USER_ROUTER_FACTORY = require('./routes/user-router');
const SHOP_ROUTER_FACTORY = require('./routes/shop-router');
const EMAIL_ROUTER_FACTORY = require('./routes/email-router');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.append('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.use('/users', USER_ROUTER_FACTORY);
app.use('/shop', SHOP_ROUTER_FACTORY);
app.use('/email', EMAIL_ROUTER_FACTORY);

app.listen(port, () => {
    console.log("Listening on port : ", port);
})

// orderitservices-firebase-adminsdk-o1nqc-6e63e2dd94

//https://orderitapi.herokuapp.com/
