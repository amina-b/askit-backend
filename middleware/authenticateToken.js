var User  = require("../models/user"),
      jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(1);
    if (token == null) {
        console.log(2);
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, userToken) => {
        if (err) {
            console.log(3);
            return res.sendStatus(403); 
        } 
        
        User.findById(userToken.userId, function(err, foundUser) {
            if (err) {
                console.log(4);
                return res.status(500).send();
            } else {
                console.log(5);
                console.log(foundUser);
                if (foundUser == null) {
                    return res.status(401).send();
                }

                req.body.userIdFromAuth = userToken.userId;
                next();
            }
        });
    });
}   

module.exports = authenticateToken;