var express                 = require("express"),
    router                  = express.Router(),
    mongoose                = require("mongoose"),
    User                    = require("../models/user"),
    bcrypt                  = require("bcrypt"),
    jwt                     = require("jsonwebtoken"),
    checkIfSameUserExists   = require("../middleware/checkIfSameUserExists");

const { check, validationResult } = require("express-validator");

router.post("/users/register", checkIfSameUserExists, [
    check("username").isEmail(),
    check("password").isLength( { min: 5 , max: 30 }),
], async function(req,res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var user = { firstname : req.body.firstname,
                 secondname : req.body.secondname,
                 username: req.body.username,
                 password: hashedPassword };

    User.create(user, function(err,user){
        if (err) {
            res.status(500).send();
        } else {
            res.status(201).send(); 
        }   
    });
});

router.post("/users/login", [
    check("username").isEmail(),
    check("password").isLength( { min: 5 , max: 30 }),
], async function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }

    var user = User.findOne({ username: req.body.username }, async function(err, user) {
        if (err) {
            return res.status(500).send();
        }

        if (user == null) {
            return res.status(404).send(); 
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                var accesToken = jwt.sign({ 
                    username: user.username,
                    userId: user.id
                }, process.env.ACCES_TOKEN_SECRET);
                let userInfo = {
                    username: user.username,
                    userId: user._id,
                    userToken: accesToken
                };
                res.status(200).send(userInfo); 
            }
            else {
                res.status(401).send(); 
            }
        } catch (e) {
            res.status(500).send();
        }
     });
});

module.exports = router;