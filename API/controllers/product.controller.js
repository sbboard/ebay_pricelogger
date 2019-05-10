const gameboyModel = require('../model/gameboy.model')

exports.whole_list = (req, res, next) => {
    gameboyModel.find({}, (err, gameboys) => {
        if (err) return next(err)
        res.send(gameboys)
    })
}