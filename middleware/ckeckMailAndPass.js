const { check, validationResult } = require("express-validator");

function checkMailAndPass(req, res, next) {

    check("username").isEmail();
    check("password").isLength( { min: 5 , max: 30 });

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }
    next();
}

module.exports = checkMailAndPass;