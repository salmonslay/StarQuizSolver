const googleIt = require('google-it')
const fs = require('fs');


fs.readFile('localization_data.txt', 'utf8', (err, data) => {
    if (err) throw err;
    var questions = {};
    var pattern = /QUIZ_\D+_Q(\d+)_(QUESTION|ANSWER)(\d)?=(.+)/gm;
    data.split("\r").forEach(line => {
        if (line.includes("QUIZ_")) {
            line = line.replace("\n", "");
            pattern.lastIndex = -1;
            var question = pattern.exec(line);
            let id = question[1];
            let isAnswer = question[2] == "ANSWER";
            let answer = question[3];
            let value = question[4];

            if (isAnswer) {
                if (!questions[id]) {
                    questions[id] = {
                        answers: []
                    }
                }
                questions[id].answers[answer - 1] = (value);

            } else {
                if (!questions[id]) {
                    questions[id] = {
                        question: value,
                        answers: []
                    }
                } else questions[id].question = value;

            }
        }
    })
    fs.writeFile('questions.json', JSON.stringify(questions), (err, res) => {
        console.log("Questions saved");
    })
})
//getAnswer("How many toes do (most) cats have?", ["18", "16", "Cats have no toes"]);

function getAnswer(question, answers) {
    var result = {
        question: question,
        likelyAnswer: null,
        answers: [{
            answer: answers[0],
            score: 0,
            exact: 0
        }, {
            answer: answers[1],
            score: 0,
            exact: 0
        }, {
            answer: answers[1],
            score: 0,
            exact: 0
        }]
    };

    //google question
    googleIt({
            'query': question
        }).then(results => {

            //go through each result & answer
            results.forEach(res => {
                for (let i = 0; i < 3; i++) {
                    if (res.snippet.toLowerCase().includes(answers[i].toLowerCase())) scores[i]++;
                }
            })

            var guess = scores.indexOf(Math.max(...scores));

            console.log(`Question: ${question}\n\nThe answer is likely ${["A","B","C"][guess]}: ${answers[guess]}\n\n`, result);
        })
        .catch(e => {
            console.error(e);
        })
}