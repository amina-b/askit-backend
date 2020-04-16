var mongoose = require("mongoose");

var answersShchema = new mongoose.Schema({
    text: String,
    userId: mongoose.ObjectId,
    questionId:  mongoose.ObjectId
});

module.exports = mongoose.model("Answer", answersShchema);