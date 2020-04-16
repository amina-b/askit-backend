var User  = require("../models/user"),
      jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, userToken) => {
        if (err) {
            return res.sendStatus(403); 
        } 
        
        User.findById(userToken.userId, function(err, foundUser) {
            if (err) {
                return res.status(500).send();
            } else {
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