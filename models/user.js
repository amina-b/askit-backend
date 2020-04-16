var mongoose = require("mongoose");

var usersSchema = new mongoose.Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("User", usersSchema);