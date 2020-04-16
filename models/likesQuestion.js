var mongoose = require("mongoose");

var likesQuestionSchema = new mongoose.Schema({
    questionId : mongoose.ObjectId,
    userId : mongoose.ObjectId,
    state : Number
});

module.exports = mongoose.model("LikesQuestion", likesQuestionSchema);