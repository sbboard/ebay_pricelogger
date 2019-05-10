const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema

const GameBoy = new Schema({
    title: {type: String, required: true},
    price: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true},
})

module.exports = mongoose.model('content', GameBoy)