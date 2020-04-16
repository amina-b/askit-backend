var mongoose = require("mongoose");

var questionsSchema = new mongoose.Schema({
    text: String,
    userId: mongoose.ObjectId,
    dateOfCreation : String,
});

module.exports = mongoose.model("Question", questionsSchema);