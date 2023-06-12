const valid = (req, res, next) => {
    const regex = /\d/g;
    const { city } = req.query;
    if (regex.test(city)) {
        res.status(404).send("Something went wrong!")
    }
    else {
        next();
    }
}
module.exports = { valid }