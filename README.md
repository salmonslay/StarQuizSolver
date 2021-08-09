# StarQuizSolver
Node.js app to automatically solve questions in the MSP Star Quiz. Yup, that MSP.

## Usage
If you just want the answers they're available at [app/en_US/readable answers.txt](https://raw.githubusercontent.com/LiterallyFabian/StarQuizSolver/master/app/en_US/readable%20answers.txt).

### Generating answers
1. Download localization data from [here](https://msp2-static.mspcdns.com/translations/multiplayergames/quiz/en_US/localization_data.txt), put it in the `app/` directory and run `parser.js`
2. You now have a file called `questions.json`. Run the `solver.js` script to generate a question-answer keypair.
3. The predicted answers can now be found in `answers.json`. To convert them into a readable format, run the `convert.js` script.

### How it works
Pretty simple but not fully accurate, for example if we have this question:
```
QUIZ_ANIMALS_Q1_QUESTION=A baby cat is called?
QUIZ_ANIMALS_Q1_ANSWER1=A kitten
QUIZ_ANIMALS_Q1_ANSWER2=A chicken
QUIZ_ANIMALS_Q1_ANSWER3=A calf
```
1. The program tries to Google the question and get the top 25 results website descriptions.
2. The program will compare how many times each answer will appear in each description. 
3. The highest score (times it appeared) is assumed to be correct.

### Problems
While questions like the one above are very easy to solve, some questions are asked in a way which makes them almost impossible, for example:
```
QUIZ_ANIMALS_Q432_QUESTION=Which of these is NOT a breed of cat
QUIZ_ANIMALS_Q432_ANSWER1=Siamese
QUIZ_ANIMALS_Q432_ANSWER2=Persian
QUIZ_ANIMALS_Q432_ANSWER3=Pomeranian
```
Googling this will most likely only bring up cat breeds, therefore the two actual cat breeds (**Siamese** & **Persian**) will be getting a higher score, while the dog breed **Pomeranian** likely won't show up and therefore get a score of 0.
