var Answer = require("../models/answer");
var mongoose = require('mongoose');

function isAllowedToModify(req, res, next) {
    Answer.findById(req.params.id, function(err, answer) {
        console.log(answer);
        console.log(req.body);
        console.log(answer);
        if (err) {
            return res.status(500).send();
        } else {
            if (answer.userId.toString() !== req.body.userIdFromAuth.toString()) {
                return res.status(401).send();
            }
        }
        next();
    });
}

module.exports = isAllowedToModify;