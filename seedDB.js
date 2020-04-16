var mongoose        = require("mongoose"),
    bcrypt          = require("bcrypt"),
    Answer          = require("./models/answer"),
    Question        = require("./models/question"),
    User            = require("./models/user"),
    likesQuestion   = require("./models/likesQuestion");

async function seedDB() {
    const users = await User.find({});
    if (users.length > 0)
        return;

    console.log('Seeding db...');

    const size = 30;

    for (let user = 1; user <= size; user++) {
        await User.create(
            {
                _id: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - user.toString().length) + user),
                username: "user" + user + "@gmail.com",
                password: await bcrypt.hash("password", 10)
            }
        );
        await Question.create(
            {
                _id: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - user.toString().length) + user),
                userId: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - user.toString().length) + user),
                text: "Question " + user,
                dateOfCreation: Date.now()
            }
        );
    }
    for (let user = 1; user <= size; user++) {
        let rand1 = 1 + Number.parseInt(Math.random() * size);
        let rand2 = 1 + Number.parseInt(Math.random() * size);
        if (rand1 > rand2) {
            let temp = rand1;
            rand1 = rand2;
            rand2 = temp;
        }

        for (let question = rand1; question <= rand2; question++)
            await Answer.create(
                {
                    userId: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - user.toString().length) + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - question.toString().length) + question)
                }
            );
    }
    
    for (let user = 1; user <= size; user++)
        for (let question = 1; question <= size; question++)
            await likesQuestion.create(
                {
                    userId: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - user.toString().length) + user),
                    questionId: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaa".slice(0, 24 - question.toString().length) + question),
                    state: Math.random() >= 0.5 ? 1 : -1
                }
            ); 

    console.log('Seeding finished.');
}

module.exports = seedDB;