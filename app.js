require("dotenv").config();

var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    bodyParser              = require("body-parser"),
    cors                    = require('cors')

var answerRoutes    = require('./routes/answers'),
    questionRoutes  = require("./routes/questions"),
    authRoutes      = require("./routes/authenticate"),
    userRoutes      = require("./routes/users")
    
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(authRoutes);
app.use(answerRoutes);
app.use(questionRoutes);
app.use(userRoutes);

mongoose.connect('mongodb://localhost:27017/askit', {useNewUrlParser: true});

app.listen(3000, function() {
    console.log("ASK-IT has started");
});