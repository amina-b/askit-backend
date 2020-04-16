var User  = require("../models/user");

function checkIfSameUserExists(req, res, next) {
    User.find({ username : req.body.username } , function(err, foundUsersWithSameName) {
        if (err) {
            return res.status(500).send();
        }
        
        if (foundUsersWithSameName.length > 0) {
            return res.status(409).send();
        }
    });
    next();
}

module.exports = checkIfSameUserExists;