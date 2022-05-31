"use strict";
//HOME PAGE DISPLAY OBJECTS
const DEFAULT_ACTIVITY_COLOUR = "#123456";
const DEFAULT_ACTIVITY_HEIGHT = "70%";
//QUIZ HELPERS
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
const PackageQuestion = (question, answer, vicinity, wrapper) => {
    const incorrectVicinity = (vicinity == undefined) ? DEFAULT_INCORRECT_ANSWER_VICINITY : vicinity;
    let possibleOptions = [];
    const possible1 = GenerateIncorrectAnswer(answer, incorrectVicinity);
    const possible2 = GenerateIncorrectAnswer(answer, incorrectVicinity);
    const possible3 = GenerateIncorrectAnswer(answer, incorrectVicinity);
    //now apply the wrapper - wrapper will be in form of x, for example if you wanted a Cos wrapper: "cos(x)"
    const questionWrapper = (wrapper == undefined) ? "x" : wrapper;
    const answerWrapped = questionWrapper.replace("x", String(answer));
    const possible1Wrapped = questionWrapper.replace("x", String(possible1));
    const possible2Wrapped = questionWrapper.replace("x", String(possible2));
    const possible3Wrapped = questionWrapper.replace("x", String(possible3));
    possibleOptions = [answerWrapped, possible1Wrapped, possible2Wrapped, possible3Wrapped];
    possibleOptions = shuffle(possibleOptions);
    return { question: question, answer: answerWrapped, options: possibleOptions };
};
//TUTORIAL HELPERS
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
        Section("Think of real life objects", "You can use your fingers to count upto 10."),
        Section("Memorise number bonds", "Memorise all the number bonds upto 10, e.g. 4+6 or 1+9, then you can become very fast at addition by compounding these together.")
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
    sections: [
        Section("Think of real life objects", "You can use your fingers to count down from 10."),
        Section("Memorise number combinations", "Memorise all the number combinations upto 10, e.g. 9-5=4 and 6-3=3.")
    ]
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
    sections: [
        Section("Memorize", "The best way to become fast at multiplication is to memorise the basic combinations upto 25, since you will not use combinations after that regularly."),
        Section("Use Addition Knowledge", "Multiplication is just a lot of addition, so you can use your addition knowledge to perform multiplication operations quickly.")
    ]
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
    sections: [
        Section("Use Multiplication Knowledge", "Division is the inverse of multiplication, so just you multiplication knowledge to help in division, for example if a question was 56 / 8 = ?, you know that 8 * 7 = 56, so the answer is 7.")
    ]
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
    sections: [
        Section("Multiplication Knowledge", "If you have practiced your multiplication combinations upto 25, then the square numbers from 0 - 25 should be easy since they are just a subset of the multiplication combinations."),
        Section("Approximate", "You can look at the last digit of the original number, then just square that to find the last digit of the result. For example if the question was square 23, you know the last digit will be 9 since 3 squared is 9.")
    ]
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
    sections: [
        Section("Memorize", "Square roots are mainly trial error, especially 2 - 3 digits, so the best way to become quick is just to memorize the perfect squares from 0 - 1000.")
    ]
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
    sections: [
        Section("Use this trick", "Square roots of 4 digit numbers are quite difficult to memorize, so use this trick below to find the square root of 1849"),
        Section("Step 1", "Look at the last digit, it is 9, so you know the last digit of the original number is either 3 or 7 (3 squared = 9, 7 squared = 49)."),
        Section("Step 2", "Look at the first 2 digits, and find the nearest square from 0 - 9 which gives a lower number, the first 2 digits are 18, then the first digit of the original number must be 4, since 4 squared is 16, and it can't be 5 since 5 squared is 25."),
        Section("Step 3", "After combining the first digit and second digit, we are left with 2 possibilities: 43 or 47. Now we can just approximate, 50 squared is 2500, and 40 squared is 1600, it is closer to 1600, so it must be 43, which gives us the result of 43.")
    ]
};
//Algebra X Symbol: 𝑥
//Square Symbol: ²
GAME_MODES["monicQuadratics"] = {
    displayTitle: "Monic Quadratics",
    displayImage: "MonicQuadratics",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "45%",
    questionCallback: () => {
        const [root1, root2] = GenerateRandomNumbers([1, 10], 2);
        const coefficient = root1 + root2;
        const yIntercept = root1 * root2;
        const question = `Factorise 𝑥² + ${coefficient}𝑥 + ${yIntercept}`;
        const answer = `(𝑥 + ${root1})(𝑥 + ${root2})`;
        const [pair1Root1, pair1Root2] = GenerateRandomNumbers([1, 10], 2); //Generating wrong answers
        const [pair2Root1, pair2Root2] = GenerateRandomNumbers([1, 10], 2);
        const [pair3Root1, pair3Root2] = GenerateRandomNumbers([1, 10], 2);
        const wrongAnswer1 = `(𝑥 + ${pair1Root1})(𝑥 + ${pair1Root2})`;
        const wrongAnswer2 = `(𝑥 + ${pair2Root1})(𝑥 + ${pair2Root2})`;
        const wrongAnswer3 = `(𝑥 + ${pair3Root1})(𝑥 + ${pair3Root2})`;
        const possibleOptions = shuffle([answer, wrongAnswer1, wrongAnswer2, wrongAnswer3]);
        return { question: question, answer: answer, options: possibleOptions };
    },
    tutorialTitle: "How to Factorise a Monic Quadratic",
    sections: []
};
const GenerateCoefficientsConstants = () => {
    return GenerateRandomNumbers([2, 9], 2).concat(GenerateRandomNumbers([1, 10], 2));
};
GAME_MODES["quadratics"] = {
    displayTitle: "Quadratics",
    displayImage: "Quadratics",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "40%",
    questionCallback: () => {
        const [bracket1Coefficient, bracket2Coefficient, bracket1Constant, bracket2Constant] = GenerateCoefficientsConstants();
        const a = bracket1Coefficient * bracket2Coefficient; //using a, b, c from polynomial: ax² + bx + c
        const b = (bracket1Coefficient * bracket2Constant) + (bracket2Coefficient * bracket1Constant);
        const c = bracket1Constant * bracket2Constant;
        const question = `Factorise ${a}𝑥² + ${b}𝑥 + ${c}`;
        const answer = `(${bracket1Coefficient}𝑥 + ${bracket1Constant})(${bracket2Coefficient}𝑥 + ${bracket2Constant})`;
        const [wrong1Bracket1Coefficient, wrong1Bracket2Coefficient, wrong1Bracket1Constant, wrong1Bracket2Constant] = GenerateCoefficientsConstants(); //Generating wrong answers
        const [wrong2Bracket1Coefficient, wrong2Bracket2Coefficient, wrong2Bracket1Constant, wrong2Bracket2Constant] = GenerateCoefficientsConstants();
        const [wrong3Bracket1Coefficient, wrong3Bracket2Coefficient, wrong3Bracket1Constant, wrong3Bracket2Constant] = GenerateCoefficientsConstants();
        const wrongAnswer1 = `(${wrong1Bracket1Coefficient}𝑥 + ${wrong1Bracket1Constant})(${wrong1Bracket2Coefficient}𝑥 + ${wrong1Bracket2Constant})`;
        const wrongAnswer2 = `(${wrong2Bracket1Coefficient}𝑥 + ${wrong2Bracket1Constant})(${wrong2Bracket2Coefficient}𝑥 + ${wrong2Bracket2Constant})`;
        const wrongAnswer3 = `(${wrong3Bracket1Coefficient}𝑥 + ${wrong3Bracket1Constant})(${wrong3Bracket2Coefficient}𝑥 + ${wrong3Bracket2Constant})`;
        const possibleOptions = shuffle([answer, wrongAnswer1, wrongAnswer2, wrongAnswer3]);
        return { question: question, answer: answer, options: possibleOptions };
    },
    tutorialTitle: "How to Factorise a Quadratic",
    sections: []
};
