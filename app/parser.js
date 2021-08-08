//================================
// This script will convert the localization data to a JSON file.
// Localization data can be downloaded in any language, although English is recommended.
// https://msp2-static.mspcdns.com/translations/multiplayergames/quiz/en_US/localization_data.txt
//================================

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
                        answers: [],
                        id: id
                    }
                }
                questions[id].answers[answer - 1] = (value);

            } else {
                if (!questions[id]) {
                    questions[id] = {
                        question: value,
                        answers: [],
                        id: id
                    }
                } else questions[id].question = value;

            }
        }
    })
    fs.writeFile('questions.json', JSON.stringify(questions), (err, res) => {
        console.log("Questions saved");
    })
})