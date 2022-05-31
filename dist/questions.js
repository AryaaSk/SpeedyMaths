"use strict";
const DEFAULT_INCORRECT_ANSWER_VICINITY = 50;
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
const PackageQuestion = (question, answer, vicinity) => {
    const incorrectVicinity = (vicinity == undefined) ? DEFAULT_INCORRECT_ANSWER_VICINITY : vicinity;
    let possibleOptions = [];
    possibleOptions.push(answer);
    possibleOptions.push(GenerateIncorrectAnswer(answer, incorrectVicinity));
    possibleOptions.push(GenerateIncorrectAnswer(answer, incorrectVicinity));
    possibleOptions.push(GenerateIncorrectAnswer(answer, incorrectVicinity));
    possibleOptions = shuffle(possibleOptions);
    return { question: question, answer: answer, options: possibleOptions };
};
const QUESTIONS = {}; //Dictionary, keys are the type of question, and value is a function which returns the question
QUESTIONS["addition"] = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
    const question = `${num1} + ${num2}`;
    const answer = num1 + num2;
    return PackageQuestion(question, answer);
};
QUESTIONS["subtraction"] = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
    const question = `${num1} - ${num2}`;
    const answer = num1 - num2;
    return PackageQuestion(question, answer);
};
QUESTIONS["multiplication"] = () => {
    const [num1, num2] = GenerateRandomNumbers([0, 15], 2);
    const question = `${num1} * ${num2}`;
    const answer = num1 * num2;
    return PackageQuestion(question, answer);
};
QUESTIONS["division"] = () => {
    const [num1, num2] = GenerateRandomNumbers([1, 15], 2);
    const result = num1 * num2;
    const question = `${result} / ${num1}`; //So that we avoid giving the user a decimal number
    const answer = num2;
    return PackageQuestion(question, answer);
};
QUESTIONS["squareNumbers"] = () => {
    const [num] = GenerateRandomNumbers([0, 20], 1);
    const question = `${num} squared`;
    const answer = num * num;
    return PackageQuestion(question, answer);
};
QUESTIONS["squareRoots3Digits"] = () => {
    const [num] = GenerateRandomNumbers([0, 20], 1);
    const result = num * num;
    const question = `Square Root of: ${result}`;
    const answer = num;
    return PackageQuestion(question, answer, 10);
};
QUESTIONS["squareRoots4Digits"] = () => {
    const [num] = GenerateRandomNumbers([32, 99], 1);
    const result = num * num;
    const question = `Square Root of: ${result}`;
    const answer = num;
    return PackageQuestion(question, answer, 10);
};
