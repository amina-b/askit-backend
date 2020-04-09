require("dotenv").config();

var express     = require("express");
var app         = express();
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
const bcrypt    = require("bcrypt");
const jwt       = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

app.use(bodyParser.json());
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/askit', {useNewUrlParser: true});

var questionsSchema = new mongoose.Schema({
    text: String,
    userId : String,
    dateOfCreation : String,
    likes: [Number],
});

var usersSchema = new mongoose.Schema({
    username: String,
    password: String
});

var answersShchema = new mongoose.Schema({
    text: String,
    userId: String,
    questionId: String
})

var likesQuestionSchema = new mongoose.Schema({
    questionId : String,
    userId : String,
    state : Number
});

var likesAnswerSchema = new mongoose.Schema({
    answerId : String,
    userId : String,
    state : Number
});

var Question  = mongoose.model("Question", questionsSchema);
var User      = mongoose.model("User", usersSchema);
var Answer    = mongoose.model("Answer", answersShchema);
var likesQuestion = mongoose.model("LikesQuestion", likesQuestionSchema);
var likesAnswer = mongoose.model("LikesAnswer", likesAnswerSchema);

app.post("/questions", authenticateToken, checkLength, function(req, res) {
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

app.get("/questions", function(req, res) {
    if (!req.query.limit) {
        Question.find({}, function(err, questions) {
            if (err) {
                res.status(500).send(); //not found
            } else {
                res.status(200).send(questions); //Ok
            }
        });  
    } else {
        Question.find({}, function(err, questions) {
            if (err) {
                res.stats(500).send(); //not gound
            } else {
                res.status(200).send(questions); //Ok
            }
        }).sort({ dateOfCreation : -1 }).limit((Number)(req.query.limit));  
    }
});

app.post("/questions/:id/answers", authenticateToken, checkLength, function(req, res) {
    Answer.create({
        text: req.body.text,
        userId: req.body.userIdFromAuth,
        questionId: req.params.id
    }, function(err, answer) {
        if (err) {
            res.status(424).send(); // ili 409?
        } else {
            res.status(201).send(answer); //kreiran odgovor
        }
    });
});

app.get("/questions/:id/answers", function(req,res) {
    Question.findById(req.params.id).populate("answers").exec(function(err, question) {
        if (err) {
            res.status(500).send(); //nije nasao
        } else {
            res.status(200).send(question); //ok
        }
    });
});

app.post("/users/register", checkMailAndPass, async function(req,res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var user = { firstname : req.body.firstname,
                 secondname : req.body.secondname,
                 username: req.body.username,
                 password: hashedPassword };

    User.create(user, function(err,user){
        if (err) {
            res.status(500).send();
        } else {
            res.status(201).send(); // uspjesno kreiran
        }
    });
});

app.post("/users/login", checkIfSameUserExists, checkMailAndPass, async function(req, res) {
    var user = User.findOne({ username: req.body.username }, async function(err, user) {
        if (err) {
            return res.status(500).send();
        }

        if (user == null) {
            return res.status(404).send(); //not found
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                var accesToken = jwt.sign({ 
                    username: user.username,
                    userId: user.id
                }, process.env.ACCES_TOKEN_SECRET);
                res.status(200).send(accesToken); //zahtjev uspio
            }
            else {
                res.status(401).send(); //failed login
            }
        } catch (e) {
            res.status(500).send(); //internal server error
        }
     });
});


app.put("/answers/:id", authenticateToken, isAllowedToModify, checkLength, function(req, res) {
    Answer.findByIdAndUpdate(req.params.id, req.body, function(err, updatedAnswer) {
        if (err) {
            res.status(500).send(); //no content succes
        } else {
            res.status(200).send(); // ok updated
        }
    });
});

app.delete("/answers/:id", authenticateToken, isAllowedToModify, function(req, res) {
    Answer.findByIdAndRemove(req.params.id, req.body, function(err) {
        if (err) {
            res.status(500).send(); //no content succes
        }
        else {
            res.status(200).send(); // ok removed
        }
    });
});

app.put("/questions/:id/likes", authenticateToken, function(req, res) {
    var user_Id = req.body.userIdFromAuth;
    likesQuestion.findOne({ questionId : req.params.id, userId : user_Id}, function(err, likeState) {
        if (err) {
            res.status(500).send();
        } else {
            if (likeState == null) {
                likesQuestion.create({
                    questionId : req.params.id,
                    userId : user_Id,
                    state : req.body.status
                });
                res.status(201).send();
            } else {
                likeState.state = req.body.status;
                likeState.save();
                res.status(202).send();
            }
        }
    });
});

app.put("/answers/:id/likes", authenticateToken, function(req, res) {
    var user_Id = req.body.userIdFromAuth;
    likesAnswer.findOne({ answerId : req.params.id, userId : user_Id}, function(err, likeState) {
        if (err) {
            res.status(500).send();
        } else {
            if (likeState == null) {
                likesAnswer.create({
                    answerId : req.params.id,
                    userId : user_Id,
                    state : req.body.status
                });
                res.status(201).send();
            } else {
                likeState.state = req.body.status;
                likeState.save();
                res.status(202).send();
            }
        }
    });
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, userToken) => {
        if (err) {
            return res.sendStatus(403); //Stigao zahtjev ali se odbija autorizacij
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


function checkIfSameUserExists(req, res, next) {
    User.find({ username : req.body.username } , function(err, foundUsersWithSameName) {
        if (err) {
            return res.status(500).send(); //???????
        }
        
        if (foundUsersWithSameName.length > 0) {
            return res.status(409).send();
        }
    });

    next();
    
}

function isAllowedToModify(req, res, next) {
    Answer.findById(req.params.id, function(err, answer) {
        if (err) {
            return res.status(500).send();
        } else {
            if (answer.userId !== req.body.userIdFromAuth) {
                return res.status(401).send();
            }
        }
        next();
    });
}

function checkMailAndPass(req, res, next) {

    check("username").isEmail();
    check("password").isLength( { min: 5 , max: 30 });

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }
    next();
}


function checkLength(req, res, next) {
    check("req.body").isLength({ min: 2, max : 1000 });

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()} );
    }
    next();
}



app.listen(8080, function() {
    console.log("ASK-IT has started");
});