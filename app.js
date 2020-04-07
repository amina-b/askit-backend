var express     = require("express");
var app         = express();
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
const bcrypt    = require("bcrypt");

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/askit', {useNewUrlParser: true});

var questionsSchema = new mongoose.Schema({
    text: String,
    userId : Number,
    dateOfCreation : String,
    timeOfCreation: String,
    likes: [Number],
    answers: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer" 
        }
    ]
});

var usersSchema = new mongoose.Schema({
    username: String,
    password: String
});

var answersShchema = new mongoose.Schema({
    text: String,
    userId : Number,
})

var Question  = mongoose.model("Question", questionsSchema);
var User      = mongoose.model("User", usersSchema);
var Answer    = mongoose.model("Answer", answersShchema);

app.post("/questions", function(req, res) {
    console.log(req);
    Question.create({
        text: req.body.text,
        userId: req.body.userId,
        dateOfCreation: Date.now()
    });
});

app.get("/questions", function(req, res) {
    if (!req.query.limit) {
        Question.find({}, function(err, questions) {
            if (err) {
                console.log(err);
            } else {
                console.log(questions);
                res.send(questions);
            }
        });  
    } else {
        Question.find({}, function(err, questions) {
            if (err) {
                console.log(err);
            } else {
                console.log(questions);
                res.send(questions);
            }
        }).sort({ dateOfCreation : -1 }).limit((Number)(req.query.limit));  
    }
});

app.post("/questions/:id/answers", function(req,res) {
    Question.findById(req.params.id, function(err, question){
        if (err) {
            console.log(err);
        } else {
            Answer.create(req.body, function(err, answer) {
                if(err){
                    console.log(err);
                } else {
                    question.answers.push(answer);
                    question.save();
                    console.log(question.answers);
                }
            });
        }
    });
});

app.get("/questions/:id/answers", function(req,res) {
    Question.findById(req.params.id).populate("answers").exec(function(err,question){
        if(err) {
            console.log(err);
        } else {
            res.send(question);
            console.log(question);
        }
    });
});

app.post("/users/register", async function(req,res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var user = { username: req.body.username, password: hashedPassword};
    User.create(user, function(err,user){
        if(err) {
            res.status(500).send();
        } else {
            res.status(201).send();
        }
    });
});

app.post("/users/login", async function(req,res){
    var user = User.findOne({ username: req.body.username }, async function(err, user){
        if(user == null) {
            res.send("cannot find");
        }
        try {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.send("Sucess");
            }
            else {
                res.send("not succes");
            }
        } catch (e) {
            res.status(500).send();
        }
     });
});






app.listen(8080, function() {
    console.log("ASK-IT has started");
});