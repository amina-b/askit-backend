var mongoose = require("mongoose");

var likesAnswerSchema = new mongoose.Schema({
    answerId : mongoose.ObjectId,
    userId : mongoose.ObjectId,
    state : Number
});

module.exports = mongoose.model("LikesAnswer", likesAnswerSchema);