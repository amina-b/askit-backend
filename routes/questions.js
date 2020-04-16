var express             = require("express"),
    router              = express.Router(),
    mongoose            = require("mongoose"),
    Question            = require("../models/question"),
    Answer              = require("../models/answer"),
    likesQuestion       = require("../models/likesQuestion"),
    authenticateToken   = require("../middleware/authenticateToken"),
    checkLength         = require("../middleware/ckeckLength");


router.post("/questions", authenticateToken, checkLength, function(req, res) {
    Question.create({
        text: req.body.text,
        userId: req.body.userIdFromAuth,
        dateOfCreation: Date.now()
    }, (error, createdQuestion) => {
        if (error) {
            res.status(500).send();
        } else {
            console.log(`question user id: ${req.body.userIdFromAuth}`);
            res.status(201).send(createdQuestion);
        }
    });
});

router.get("/questions", function(req, res) {
    if (!req.query.limit) {
        Question.find({}, function(err, questions) {
            if (err) {
                res.status(500).send(); 
            } else {
                res.status(200).send(questions); 
            }
        }).sort({ dateOfCreation : -1 });  
    } else {
        Question.find({}, function(err, questions) {
            if (err) {
                res.stats(500).send(); 
            } else {
                res.status(200).send(questions); 
            }
        }).sort({ dateOfCreation : -1 }).limit((Number)(req.query.limit));  
    }
});

router.get("/user-questions", authenticateToken, function(req, res) {
    if (!req.query.limit) {
        Question.find({ userId: req.body.userIdFromAuth}, function(err, questions) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(200).send(questions);
            }
        })
    } else {
        Question.find({ userId: req.body.userIdFromAuth}, function(err, questions) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(200).send(questions);
            }
        }).limit((Number)(req.query.limit));
    }
});

router.post("/questions/:id/answers", authenticateToken, checkLength, function(req, res) {
    Answer.create({
        text: req.body.text,
        userId: req.body.userIdFromAuth,
        questionId: req.params.id
    }, function(err, answer) {
        if (err) {
            res.status(424).send();
        } else {
            res.status(201).send(answer); 
        }
    });
});

router.get("/questions/:id", function(req,res) {
    Question.findById(req.params.id, function(err, question) {
        if (err) {
            res.status(500).send(); 
        } else {
            res.status(200).send(question);
        }
    });
});

router.get("/questions/:id/answers", function(req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    Answer.find({ questionId: id }, function(err, answers) {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).send(answers);
        }
    })
});

router.get("/hot-questions", function(req, res) {
    likesQuestion.aggregate([{ 
        $group: { 
            "_id": "$questionId", 
            likes: { $sum: {$cond: [{$gt: ['$state', 0]}, 1, 0]}}, 
            dislikes: { $sum: {$cond: [{$lt: ['$state', 0]}, 1, 0]}}
            }
        },
        { $lookup: { from: "questions", localField: "_id", foreignField: "_id", as: "question_info" }}, 
        { $sort: { "likes": -1 }}
        ]).exec((err, results) => {
        if (err) {
            res.stats(500).send(); 
        } else {
            console.log(results);
            res.status(200).send(results.map(result => ({
                questionId: result._id,
                text: result.question_info[0].text,
                likes: result.likes,
                dislikes: result.dislikes
            })));
        }
    })
});

router.put("/questions/:id/likes", authenticateToken, function(req, res) {
    var user_Id = req.body.userIdFromAuth;
    likesQuestion.findOne({ questionId : req.params.id, userId : user_Id}, function(err, likeState) {
        if (err) {
            res.status(500).send();
        } else {
            if (likeState == null) {
                likesQuestion.create({
                    questionId : req.params.id,
                    userId : user_Id,
                    state : req.body.state
                });
                res.status(201).send();
            } else {
                likeState.state = req.body.state;
                likeState.save();
                res.status(202).send();
            }
        }
    });
});

module.exports = router;