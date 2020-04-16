const { check, validationResult } = require("express-validator");

function checkLength(req, res, next) {
    check("req.body").isLength({ min: 2, max : 1000 });

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }
    next();
}

module.exports = checkLength;