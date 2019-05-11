const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));

const dev_db_url = `mongodb+srv://buffum:${config.mondo_secret}@cluster0-thkhg.mongodb.net/test`
const mongoDB = process.env.MONGODB_URI || dev_db_url
mongoose.connect(mongoDB, {useNewUrlParser: true})
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const product = require('./routes/product.route')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use('/', product)

const port = (process.env.PORT || 8128)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})