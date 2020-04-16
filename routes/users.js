var express     = require("express"),
    router      = express.Router(),
    mongoose    = require("mongoose"),
    Answer      = require("../models/answer");

router.get("/top-users", function(req, res) {
    Answer.aggregate([
        { $group: { _id: "$userId", numberOfAnswers: { $sum: 1 }}}, 
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user_info" }},
        { $sort: { numberOfAnswers: -1 }},
        { $limit: 20 }
    ]).exec((err, results) => {
        if (err) {
            res.stats(500).send(); 
        } else {
            res.status(200).send(results.map(result => ({
                userId: result._id,
                username: result.user_info[0].username,
                numberOfAnswers: result.numberOfAnswers
            }))); 
        }
    })
});

module.exports = router;