"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//Generating Question Callbacks
const QUIZ_LENGTH = 10;
const OPTION_COUNT = 4;
const INCORRECT_ANSWER_VICINITY = 50;
const GenerateRandomNumbers = (range, quantity) => {
    const numberList = [];
    for (let i = 0; i != quantity; i += 1) {
        const offset = Math.round((Math.random() * (range[1] - range[0])));
        const num = range[0] + offset;
        numberList.push(num);
    }
    return numberList;
};
const GenerateIncorrectAnswer = (answer, vicinity) => {
    const answerOffset = Math.floor(Math.random() * vicinity * 2); //incorrect answer will be within the vicinity of the answer, e.g. vicinity = 100, incorrect answer will always be within 100 of the answer
    const incorrectAnswer = answer - vicinity + answerOffset;
    return incorrectAnswer;
};
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
const PackageQuestion = (question, answer) => {
    let possibleOptions = [];
    possibleOptions.push(answer);
    possibleOptions.push(GenerateIncorrectAnswer(answer, INCORRECT_ANSWER_VICINITY));
    possibleOptions.push(GenerateIncorrectAnswer(answer, INCORRECT_ANSWER_VICINITY));
    possibleOptions.push(GenerateIncorrectAnswer(answer, INCORRECT_ANSWER_VICINITY));
    possibleOptions = shuffle(possibleOptions);
    return { question: question, answer: answer, options: possibleOptions };
};
const ADDITION_QUESTION = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
    const question = `${num1} + ${num2}`;
    const answer = num1 + num2;
    return PackageQuestion(question, answer);
};
const SUBTRACTION_QUESTION = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
    const question = `${num1} - ${num2}`;
    const answer = num1 - num2;
    return PackageQuestion(question, answer);
};
const MULTIPLICATION_QUESTION = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 15], 2);
    const question = `${num1} * ${num2}`;
    const answer = num1 * num2;
    return PackageQuestion(question, answer);
};
const DIVISION_QUESTION = () => {
    const [num1, num2] = GenerateRandomNumbers([1, 15], 2);
    const result = num1 * num2;
    const question = `${result} / ${num1}`; //So that we avoid giving the user a decimal number
    const answer = num2;
    return PackageQuestion(question, answer);
};
const CreateQuestions = () => {
    //@ts-expect-error
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
    //@ts-expect-error
    const quizType = params.type;
    const questions = [];
    for (let i = 0; i != QUIZ_LENGTH; i += 1) {
        let question;
        switch (quizType) {
            case "addition":
                question = ADDITION_QUESTION();
                break;
            case "subtraction":
                question = SUBTRACTION_QUESTION();
                break;
            case "multiplication":
                question = MULTIPLICATION_QUESTION();
                break;
            case "division":
                question = DIVISION_QUESTION();
            default:
                continue;
        }
        questions.push(question);
    }
    return questions;
};
const LoadQuestion = (question) => {
    const promise = new Promise((resolve) => {
        document.getElementById("question").innerText = question.question;
        document.getElementById("option1").innerText = String(question.options[0]);
        document.getElementById("option2").innerText = String(question.options[1]);
        document.getElementById("option3").innerText = String(question.options[2]);
        document.getElementById("option4").innerText = String(question.options[3]);
        document.getElementById("option1").onclick = () => { clickedAnswer(0); };
        document.getElementById("option2").onclick = () => { clickedAnswer(1); };
        document.getElementById("option3").onclick = () => { clickedAnswer(2); };
        document.getElementById("option4").onclick = () => { clickedAnswer(3); };
        const clickedAnswer = (index) => {
            if (question.options[index] == question.answer) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        };
    });
    return promise;
};
const DoQuiz = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    let score = 0;
    for (const question of questions) {
        const correct = yield LoadQuestion(question);
        if (correct == true) {
            score += 1;
        }
    }
    return score;
});
const MAIN_QUIZ = () => __awaiter(void 0, void 0, void 0, function* () {
    const questions = CreateQuestions();
    const score = yield DoQuiz(questions);
    console.log(score);
});
MAIN_QUIZ();
