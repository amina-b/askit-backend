var express             = require("express"),
    router              = express.Router(),
    mongoose            = require("mongoose"),
    isAllowedToModify   = require("../middleware/isAllowedToModify"),
    authenticateToken   = require("../middleware/authenticateToken"),
    Answer              = require("../models/answer"),
    likesAnswer         = require("../models/likesAnswer"),
    { check, validationResult } = require("express-validator");

router.put("/answers/:id", authenticateToken, isAllowedToModify,
    check("text").isLength({ min: 2, max : 1000 }), function(req, res) {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }

    Answer.findByIdAndUpdate(req.params.id, req.body, function(err, updatedAnswer) {
        if (err) {
            res.status(500).send(); 
        } else {
            res.status(200).send(); 
        }
    });
});

router.delete("/answers/:id", authenticateToken, isAllowedToModify,  function(req, res) {
    Answer.findByIdAndRemove(req.params.id, req.body, function(err) {
        if (err) {
            res.status(500).send(); 
        }
        else {
            res.status(200).send(); 
        }
    });
});

router.put("/answers/:id/likes",  function(req, res) {
    var user_Id = req.body.userIdFromAuth;
    likesAnswer.findOne({ answerId : req.params.id, userId : user_Id}, function(err, likeState) {
        if (err) {
            res.status(500).send();
        } else {
            if (likeState == null) {
                likesAnswer.create({
                    answerId : req.params.id,
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