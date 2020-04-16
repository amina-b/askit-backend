

async function seed() {
    for (let user = 1; user <= 7; user++) {
        await User.create(
            {
                _id: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                username: "User" + i,
                password: await bcrypt.hash("password", 10)
            }
        );
        await Questions.create(
            {
                userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                text: "Question " + user,
                dateOfCreation: Date.now()
            }
        );
    }
    for (let user = 1; user <= 7; user++)
        for (let question = 1; question <= 7; question++)
            await Answer.create([
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                }, 
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    text: "Answer to Question " + question + " from user " + user,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                }]
            );
    
    for (let user = 1; user <= 7; user++)
        for (let question = 1; question <= 7; question++)
            await likesQuestion.create([
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question),
                    state: Math.random() >= 0.5 ? 1 : -1
                }, 
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                },
                {
                    userId: new mongoose.Types.ObjectId("11111111111111111111111" + user),
                    state: Math.random() >= 0.5 ? 1 : -1,
                    questionId: new mongoose.Types.ObjectId("11111111111111111111111" + question)
                }]
            );
}