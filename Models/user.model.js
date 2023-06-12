const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    city: String,
    searchers: []
})
const UserModel = mongoose.model("users", userSchema);
module.exports = { UserModel };