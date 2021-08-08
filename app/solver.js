//================================
// This script will generate a 
//================================

const googleIt = require('google-it');
const fs = require('fs');
const timer = ms => new Promise(res => setTimeout(res, ms))

fs.readFile('questions.json', 'utf8', (err, data) => {
    answerQuestions(Object.values(JSON.parse(data)));
});

async function answerQuestions(data) {
    var answers = {};
    for (var i = 0; i < data.length; i++) {
        var entry = data[i];
        await getAnswer(entry.question, entry.answers).then(ans => {
            answers[parseInt(entry.id)] = ans.exactGuess;
            console.log(`Question: ${entry.question}\nAnswer: ${ans.likelyAnswer}\n\n`);
        })

        //await timer(2000);
    }

    fs.writeFile('answers.json', JSON.stringify(answers), (err, res) => {
        console.log("Answers saved");
    })
}

async function getAnswer(question, answers) {
    return new Promise(resolve => {
        var result = {
            question: question,
            likelyAnswer: null,
            wordGuess: null,
            exactGuess: null,
            answers: [{
                answer: answers[0],
                score: 0,
                exact: 0,
                correct: false
            }, {
                answer: answers[1],
                score: 0,
                exact: 0,
                correct: false
            }, {
                answer: answers[2],
                score: 0,
                exact: 0,
                correct: false
            }]
        };
        var wordScores = [0, 0, 0];
        var exactScores = [0, 0, 0];

        //google question
        googleIt({
                'query': question,
                'disableConsole': true
            }).then(results => {

                //go through each result & answer
                results.forEach(res => {
                    for (let i = 0; i < 3; i++) {
                        var snippet = res.snippet.toLowerCase();
                        var fullAnswer = answers[i].toLowerCase();
                        if (snippet.includes(fullAnswer)) exactScores[i]++;
                        fullAnswer.split(" ").forEach(word => {
                            if (snippet.includes(word)) wordScores[i]++;
                        })
                    }
                })

                result.wordGuess = wordScores.indexOf(Math.max(...wordScores));
                result.exactGuess = exactScores.indexOf(Math.max(...exactScores));
                result.likelyAnswer = result.answers[result.exactGuess].answer;
                result.answers[result.exactGuess].correct = true;

                result.answers[0].score = wordScores[0];
                result.answers[1].score = wordScores[1];
                result.answers[2].score = wordScores[2];

                result.answers[0].exact = exactScores[0];
                result.answers[1].exact = exactScores[1];
                result.answers[2].exact = exactScores[2];

                resolve(result)
                //console.log(`Question: ${question}\n\nThe answer is likely ${["A","B","C"][guess]}: ${answers[guess]}\n\n`, result);
            })
            .catch(e => {
                console.error(e);
            })
    });
}