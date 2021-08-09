const fs = require('fs');

fs.readFile("answers.json", (err, data) => {
    if (err) throw err;
    var readable = "";
    var answers = JSON.parse(data);

    fs.readFile("questions.json", (err, data) => {
        var questions = JSON.parse(data);

        Object.values(questions).forEach(entry => {
            readable += `${entry.question}\n${entry.answers[answers[entry.id]]}\n\n`;
        })

        readable = readable.split("\n");
        const CreateFiles = fs.createWriteStream('readable answers.txt')
        for (let i = 0; i < readable.length; i++) {
            CreateFiles.write(readable[i] + '\r\n')
        }
    })
})