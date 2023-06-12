const mongoose = require('mongoose');
const { UserModel } = require('../Models/user.model');
const auth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        var decoded = jwt.verify(token, 'shhhhh');
        const data = await UserModel.findById(decoded.userID)
        if (decoded && data) {
            next();
        }
        else {
            res.send("You're are not logged in")
        }
    }
    else {
        res.send("You're are not logged in")
    }
}
module.exports = { auth };