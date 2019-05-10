exports.whole_list = (req, res, next) => {
    Product.find({}, (err, gameboys) => {
        if (err) return next(err)
        res.send(gameboys)
    })
}