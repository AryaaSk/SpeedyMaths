//HOME PAGE DISPLAY OBJECTS
const DEFAULT_ACTIVITY_COLOUR = "#123456";
const DEFAULT_ACTIVITY_HEIGHT = "70%";





//QUIZ HELPERS
const DEFAULT_INCORRECT_ANSWER_VICINITY = 50;

const GenerateRandomNumbers = (range: number[], quantity: number) => { //Lower bound and Upper bound are inclusive
    const numberList = [];
    for (let i = 0; i != quantity; i += 1) {
        const offset = Math.round((Math.random() * (range[1] - range[0])));
        const num = range[0] + offset;
        numberList.push(num);
    }
    return numberList
}

const GenerateIncorrectAnswer = (answer: number, vicinity: number) => {
    const answerOffset = Math.floor(Math.random() * vicinity * 2); //incorrect answer will be within the vicinity of the answer, e.g. vicinity = 100, incorrect answer will always be within 100 of the answer
    const incorrectAnswer = answer - vicinity + answerOffset;
    return incorrectAnswer;
}

function shuffle(array: any[]) { //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

interface Question {
    question: string,
    answer: string,
    options: string[]
}

const PackageQuestion = (question: string, answer: number, vicinity?: number, wrapper?: string): Question => { //packages question into interface type and also generates incorrect answers
    const incorrectVicinity = (vicinity == undefined) ? DEFAULT_INCORRECT_ANSWER_VICINITY : vicinity;

    let possibleOptions: string[] = [];
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

    return { question: question, answer: answerWrapped, options: possibleOptions};
}





//TUTORIAL HELPERS
const Section = (subtitle: string, content: string) => {
    return { subtitle: subtitle, content: content };
}





//ALL COMBINED GAME MODE INTERFACE
interface GameMode {
    //Home screen
    displayTitle: string
    displayImage: string, //e.g. Addition for Addition.svg
    imageColour: string,
    imageHeight: string

    //Quiz
    questionCallback: () => Question //to generate a random question everytime

    //Tutorials
    tutorialTitle: string
    sections: {
        subtitle: string
        content: string,
    }[]
}






//ACTUAL GAME MODES
const GAME_MODES: { [type: string] : GameMode } = {};

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
    displayTitle: "Square Roots\n(2 - 3 digits)",
    displayImage: "SquareRootShort",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",

    questionCallback: () => {
        const [num] = GenerateRandomNumbers([0, 20], 1);
        const result = num * num;
        const question = `Square Root of: ${result}`;
        const answer = num;
        return PackageQuestion(question, answer, 10);
    },

    tutorialTitle: "How to calculate Square Roots (2 - 3 digits)",
    sections: [
        Section("Memorize", "Square roots are mainly trial error, especially 2 - 3 digits, so the best way to become quick is just to memorize the perfect squares from 0 - 1000.")
    ]
};


GAME_MODES["squareRoots4Digits"] = {
    displayTitle: "Square Roots\n(4 digits)",
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

    tutorialTitle: "How to calculate Square Roots (4 digits)",
    sections: [
        Section("Use this trick", "Square roots of 4 digit numbers are quite difficult to memorize, so use this trick below to find the square root of 1849"),
        Section("Step 1", "Look at the last digit, it is 9, so you know the last digit of the original number is either 3 or 7 (3 squared = 9, 7 squared = 49)."),
        Section("Step 2", "Look at the first 2 digits, and find the nearest square from 0 - 9 which gives a lower number, the first 2 digits are 18, then the first digit of the original number must be 4, since 4 squared is 16, and it can't be 5 since 5 squared is 25."),
        Section("Step 3", "After combining the first digit and second digit, we are left with 2 possibilities: 43 or 47. Now we can just approximate, 50 squared is 2500, and 40 squared is 1600, it is closer to 1600, so it must be 43, which gives us the result of 43.")

    ]
};

GAME_MODES["cubeRoots"] = {
        displayTitle: "Cube Roots",
        displayImage: "CubeRoots",
        imageColour: DEFAULT_ACTIVITY_COLOUR,
        imageHeight: "60%",

        questionCallback: () => {
            const [num] = GenerateRandomNumbers([0, 15], 1);
            const result = num ** 3;
            const question = `Cube Root of: ${result}`;
            const answer = num;
            return PackageQuestion(question, answer, 10);
        },

        tutorialTitle: "How to calculate Cube Roots",
        sections: [
            Section("Look at the last digit", "You can get fast at approximating a cube root, by looking at it's last digit, for example if the last digit is 5 then the original number must end in a 5.")
        ]
}


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

    tutorialTitle: "How to factorise a Monic Quadratic",
    sections: [
        Section("Remember the factors", "It is a good idea to know a lot of factor pairs from memory, this is because once you know a lot you can find the correct factor pair which fits the equation."),
        Section("Find where (F1 * F2 = C) AND (F1 + F2 = B)", "In monic quadratics, since the there is never a coefficient before the 𝑥, you just need to find a factor pair which satisfys these 2 conditions.\n B and C come from the polynomial a𝑥² + b𝑥 + c, which will be in the question.")
    ]
};


const GenerateCoefficientsConstants = () => {
    return GenerateRandomNumbers([2, 9], 2).concat(GenerateRandomNumbers([1, 10], 2));
}
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

    tutorialTitle: "How to factorise a Quadratic",
    sections: [
        Section("Memorize factor pairs upto 100", "In quadratics, you will regularly be using factor pairs upto the number 100, after that it is usually better to solve the equation using other methods such as Completing the Square and the Quadratic Formula."),
        Section("Find where (𝑥F1 * 𝑥F2) = A AND (F1 * F2) = C AND (𝑥F1 * F2) + (𝑥F2 * F1) = B", "This looks much more complicated than it actually is, once you know the factor pairs it should be simple. 𝑥F1 and 𝑥F2 refer to the factor pairs of 𝑥's coefficient, F1 and F2 refer to the factor pairs which make C.\n A, B and C come from the polynomial a𝑥² + b𝑥 + c, which will be in the question.")
    ]
};

//Subscript 2: ₂
GAME_MODES["logarithms"] = {
    displayTitle: "Logarithms",
    displayImage: "Logarithms",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "35%",

    questionCallback: () => {
        const [base] = GenerateRandomNumbers([2, 6], 1);
        const [exponent] = GenerateRandomNumbers([0, 5], 1);
        const result = base ** exponent;

        const question = `log<sub>${base}</sub>(${result})`;
        const answer = exponent;
        return PackageQuestion(question, answer, 5);
    },

    tutorialTitle: "How to calculate Logarithms",
    sections: [
        Section("Think about exponents", "Logarithms are just the inverse to exponents, for example 2^𝑥 = 8, is the same as 𝑥 = log₂(8), therefore you can solve 𝑥 to be 3, due to exponents practice.")
    ]
}