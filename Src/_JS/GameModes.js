"use strict";
//HOME PAGE DISPLAY OBJECTS
const DEFAULT_ACTIVITY_COLOUR = "#123456";
const DEFAULT_ACTIVITY_HEIGHT = "70%";
//QUIZ OBJECTS
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
//TUTORIAL OBJECTS
const Section = (subtitle, content) => {
    return { subtitle: subtitle, content: content };
};
//ACTUAL GAME MODES
const GAME_MODES = {};
GAME_MODES["addition"] = {
    displayTitle: "Addition",
    displayImage: "Addition",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: DEFAULT_ACTIVITY_HEIGHT,
    questionCallback: () => {
        const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
        const question = `${num1} + ${num2}`;
        const answer = num1 + num2;
        return PackageQuestion(question, answer);
    },
    tutorialTitle: "How to do Addition",
    sections: [
        Section("Think of real life objects", "You can use your fingers to count upto 10"),
        Section("Memorise number bonds", "Memorise all the number bonds upto 10, e.g. 4+6 or 1+9, then you can become very fast by compounding these together")
    ]
};
GAME_MODES["subtraction"] = {
    displayTitle: "Subtraction",
    displayImage: "Subtraction",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "20%",
    questionCallback: () => {
        const [num1, num2] = GenerateRandomNumbers([0, 100], 2);
        const question = `${num1} - ${num2}`;
        const answer = num1 - num2;
        return PackageQuestion(question, answer);
    },
    tutorialTitle: "How to do Subtraction",
    sections: []
};
GAME_MODES["multiplication"] = {
    displayTitle: "Multiplication",
    displayImage: "Multiplication",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: DEFAULT_ACTIVITY_HEIGHT,
    questionCallback: () => {
        const [num1, num2] = GenerateRandomNumbers([0, 15], 2);
        const question = `${num1} * ${num2}`;
        const answer = num1 * num2;
        return PackageQuestion(question, answer);
    },
    tutorialTitle: "How to do Multiplication",
    sections: []
};
GAME_MODES["division"] = {
    displayTitle: "Division",
    displayImage: "Division",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: DEFAULT_ACTIVITY_HEIGHT,
    questionCallback: () => {
        const [num1, num2] = GenerateRandomNumbers([1, 15], 2);
        const result = num1 * num2;
        const question = `${result} / ${num1}`; //So that we avoid giving the user a decimal number
        const answer = num2;
        return PackageQuestion(question, answer);
    },
    tutorialTitle: "How to do Division",
    sections: []
};
GAME_MODES["squareNumbers"] = {
    displayTitle: "Square Numbers",
    displayImage: "XSquared",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: DEFAULT_ACTIVITY_HEIGHT,
    questionCallback: () => {
        const [num] = GenerateRandomNumbers([0, 20], 1);
        const question = `${num} squared`;
        const answer = num * num;
        return PackageQuestion(question, answer);
    },
    tutorialTitle: "How to Square a Number",
    sections: []
};
GAME_MODES["squareRoots3Digits"] = {
    displayTitle: "Square Roots (2 - 3 digits)",
    displayImage: "SquareRoot",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",
    questionCallback: () => {
        const [num] = GenerateRandomNumbers([0, 20], 1);
        const result = num * num;
        const question = `Square Root of: ${result}`;
        const answer = num;
        return PackageQuestion(question, answer, 10);
    },
    tutorialTitle: "How to Square Root (2 - 3 digits)",
    sections: []
};
GAME_MODES["squareRoots4Digits"] = {
    displayTitle: "Square Roots (4 digits)",
    displayImage: "SquareRoot",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",
    questionCallback: () => {
        const [num] = GenerateRandomNumbers([32, 99], 1);
        const result = num * num;
        const question = `Square Root of: ${result}`;
        const answer = num;
        return PackageQuestion(question, answer, 10);
    },
    tutorialTitle: "How to Square Root (4 digits)",
    sections: []
};
