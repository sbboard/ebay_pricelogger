const express = require('express')
const router = express.Router()

const product_controller = require('../controllers/product.controller')

//router.get('/:num', product_controller.daysLimit)

router.get('/', product_controller.whole_list)

module.exports = router