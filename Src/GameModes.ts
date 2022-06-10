//HOME PAGE DISPLAY OBJECTS
const DEFAULT_ACTIVITY_COLOUR = "#123456";
const DEFAULT_ACTIVITY_HEIGHT = "70%";





//QUIZ HELPERS
const DEFAULT_INCORRECT_ANSWER_VICINITY = 50;
const DEFAULT_DP = 2;

const GenerateRandomNumbers = (range: number[], quantity: number) => { //Lower bound and Upper bound are inclusive
    const numberList = [];
    for (let i = 0; i != quantity; i += 1) {
        const offset = Math.round((Math.random() * (range[1] - range[0])));
        const num = range[0] + offset;
        numberList.push(num);
    }
    return numberList
}

const GenerateIncorrectAnswer = (answer: number, vicinity: number): number => {
    const answerOffset = Math.floor(Math.random() * vicinity * 2); //incorrect answer will be within the vicinity of the answer, e.g. vicinity = 100, incorrect answer will always be within 100 of the answer
    const incorrectAnswer = answer - vicinity + answerOffset;
    if (incorrectAnswer < 0) {
        return GenerateIncorrectAnswer(answer, vicinity); //to prevent negative numbers
    }
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
const Round = (num: number, dp: number) => {
    const precision = 10 ** dp;
    const multiplied = num * precision;
    const rounded = Math.round(multiplied);
    const original = rounded / precision;
    return original;
}

interface Question {
    question: string,
    answer: string,
    options: string[]
}

const PackageQuestion = (question: string, answer: number, vicinity?: number, wrapper?: string, dp?: number): Question => { //packages question into interface type and also generates incorrect answers
    const incorrectVicinity = (vicinity == undefined) ? DEFAULT_INCORRECT_ANSWER_VICINITY : vicinity;
    const roundDP = (dp == undefined) ? DEFAULT_DP : dp;

    let possibleOptions: string[] = [];
    const possible1 = GenerateIncorrectAnswer(answer, incorrectVicinity);
    const possible2 = GenerateIncorrectAnswer(answer, incorrectVicinity);
    const possible3 = GenerateIncorrectAnswer(answer, incorrectVicinity);

    //now apply the wrapper - wrapper will be in form of x, for example if you wanted a Cos wrapper: "cos(x)"
    const questionWrapper = (wrapper == undefined) ? "x" : wrapper;
    const answerWrapped = questionWrapper.replace("x", String(Round(answer, roundDP))); //also rounding them to avoid too many decimal places
    const possible1Wrapped = questionWrapper.replace("x", String(Round(possible1, roundDP)));
    const possible2Wrapped = questionWrapper.replace("x", String(Round(possible2, roundDP)));
    const possible3Wrapped = questionWrapper.replace("x", String(Round(possible3, roundDP)));
    
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
        const [int1, int2] = GenerateRandomNumbers([0, 100], 2);
        const num1 = (int1 >= int2) ? int1 : int2; //to prevent it from going into negative numbers
        const num2 = (int1 < int2) ? int1 : int2;

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
        const question = `${num}²`;
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


function reduce(numerator: number,denominator: number){ //https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
    var gcd = function gcd(a: any,b: any): any{
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(numerator,denominator);
    return [numerator/(<number>(<unknown>gcd)), denominator/(<number>(<unknown>gcd))];
}
const formatFractionQuestion = (fraction: number[]) => {
    return `<sup>${fraction[0]}</sup>/<sub>${fraction[1]}</sub>`;
}
const formatFractionAnswer = (fraction: number[]) => {
    return `<div class="numerator">${fraction[0]}</div><div class="denominator">${fraction[1]}</div>`;
}
GAME_MODES["fractionAddition"] = {
    displayTitle: "Fraction Addition",
    displayImage: "FractionAddition",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "70%",

    questionCallback: () => {
        const [numerator1, denominator1] = GenerateRandomNumbers([1, 10], 2);
        const [numerator2, denominator2] = GenerateRandomNumbers([1, 10], 2);
        const fraction1 = reduce(numerator1, denominator1);
        const fraction2 = reduce(numerator2, denominator2);

        const normalizedNumerator1 = fraction1[0] * fraction2[1];
        const normalizedNumerator2 = fraction1[1] * fraction2[0];
        const normalizedDenominator = fraction1[1] * fraction2[1];

        const answerFraction = reduce(normalizedNumerator1 + normalizedNumerator2, normalizedDenominator);
        const wrongAnswer1 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 5));
        const wrongAnswer2 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 5));
        const wrongAnswer3 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 5));

        const question = `${formatFractionQuestion(fraction1)} + ${formatFractionQuestion(fraction2)}`;
        const possibleOptions = shuffle([formatFractionAnswer(answerFraction), formatFractionAnswer(wrongAnswer1), formatFractionAnswer(wrongAnswer2), formatFractionAnswer(wrongAnswer3)]);

        return { question: question, answer: formatFractionAnswer(answerFraction), options: possibleOptions };
    },

    tutorialTitle: "How to add together Fractions",
    sections: [
        Section("Find Common Denominator", "To add together 2 fractions, first you need to make sure they have the same denomiantor, to do this try and find the LCM of the 2 denominators, if you are stuck then you can just multiply both of them together."),
        Section("Add together Numerators", "Once you have a common multiple for the denominators, multiply both sides of the fraction until the denominator has reached that.\nThen once both fractions have the same denominator, you can just add them together."),
        Section("Simplify Result", "After adding together both numerators, you will be left with a fraction with this total/(common denominator), then just simplify the fraction until you cannot reduce either side anymore.")
    ]
}


//Right Arrow: ⟶
GAME_MODES["fractionMultiplication"] = {
    displayTitle: "Fraction Multiplication",
    displayImage: "FractionMultiplication",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "70%",

    questionCallback: () => {
        const [numerator1, denominator1] = GenerateRandomNumbers([1, 10], 2);
        const [numerator2, denominator2] = GenerateRandomNumbers([1, 10], 2);
        const fraction1 = reduce(numerator1, denominator1);
        const fraction2 = reduce(numerator2, denominator2);

        const answerFraction = reduce(fraction1[0] * fraction2[0], fraction1[1] * fraction2[1]);
        const wrongAnswer1 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 10));
        const wrongAnswer2 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 10));
        const wrongAnswer3 = reduce(GenerateIncorrectAnswer(answerFraction[0], 10), GenerateIncorrectAnswer(answerFraction[1], 10));

        const question = `${formatFractionQuestion(fraction1)} * ${formatFractionQuestion(fraction2)}`;
        const possibleOptions = shuffle([formatFractionAnswer(answerFraction), formatFractionAnswer(wrongAnswer1), formatFractionAnswer(wrongAnswer2), formatFractionAnswer(wrongAnswer3)]);

        return { question: question, answer: formatFractionAnswer(answerFraction), options: possibleOptions };
    },

    tutorialTitle: "How to multiply together Fractions",
    sections: [
        Section("Multiply Numerator and Denominator", "Just simply multiply both the numerators and both the denominators to give you your new fraction."),
        Section("Reduce Result", "Once you have this result fraction, just simplify it by dividing both numerator and denominator by the same number until one of them cannot be divided anymore.")
    ]
}


GAME_MODES["fractionToPercentage"] = {
    displayTitle: "Fraction ⟶ Percentage",
    displayImage: "FractionToPercentage",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",

    questionCallback: () => {
        const [numerator] = GenerateRandomNumbers([1, 10], 1);
        const [denominator] = GenerateRandomNumbers([5, 20], 1); //sqewing distribution of fractions to >1
        const fraction = reduce(numerator, denominator);

        const question = `${formatFractionQuestion(fraction)}`;
        const answer = numerator / denominator * 100;
        return PackageQuestion(question, answer, undefined, "x%"); //custom % wrapper
    },

    tutorialTitle: "How to convert Fractions to Percentages",
    sections: [
        Section("Find Decimal", "Divide numerator / denominator"),
        Section("Convert to Percentage", "You have the decimal representation of the number, however you need to multiply by 100 to convert it to a percentage")
    ]
}


GAME_MODES["numberPercentages"] = {
    displayTitle: "Percentages",
    displayImage: "Percentages",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",

    questionCallback: () => {
        const [percentage] = GenerateRandomNumbers([0, 100], 1);
        const [original] = GenerateRandomNumbers([0, 500], 1); //always a nice question

        const question = `${percentage}% of ${original}`;
        const answer = (percentage / 100) * original;
        return PackageQuestion(question, answer);
    },

    tutorialTitle: "How to calculate Percentages of Numbers",
    sections: [
        Section("Multiply by %/100", "The simplest way to find percentages is to multiply the original number by the (percentage/100).\nFor example if the original number was 500, and the percentage was 40%, then you can find the answer by doing 500 * 0.4 = 200."),
        Section("Convert Percentage to Fraction", "Another way of calculating percentages which is sometimes easier, is to convert the percentage into a fraction.\nUsing the example above (40% of 500), we can convert 40% into 2/5, and then we can easily find the answer by multiplying 500 by 2/5, which gives us 200."),
        Section("Swap the question", "Another technique you can use is flipping the question.\nIn the example above (40% of 500), you can instead turn the question into 500% of 40, and then just multiply 40 by 5, to get the answer 200.")
    ]
}


const formatRatio = (ratio: number[]) => {
    return `${ratio[0]} : ${ratio[1]}`;
}
GAME_MODES["ratios"] = {
    displayTitle: "Ratios",
    displayImage: "Ratio",
    imageColour: DEFAULT_ACTIVITY_COLOUR,
    imageHeight: "60%",

    questionCallback: () => {
        const [left, right] = GenerateRandomNumbers([1, 15], 2);
        const [scale] = GenerateRandomNumbers([1, 10], 1);
        const ratio = reduce(left, right);
        const multiple = [ratio[0] * scale, ratio[1] * scale];

        const answer = formatRatio(ratio);
        const question = `Simply ${formatRatio(multiple)}`;
        const wrong1 = formatRatio([GenerateIncorrectAnswer(ratio[0], 10), GenerateIncorrectAnswer(ratio[1], 10)]);
        const wrong2 = formatRatio([GenerateIncorrectAnswer(ratio[0], 10), GenerateIncorrectAnswer(ratio[1], 10)]);
        const wrong3 = formatRatio([GenerateIncorrectAnswer(ratio[0], 10), GenerateIncorrectAnswer(ratio[1], 10)]);
        const possibleOptions = shuffle([answer, wrong1, wrong2, wrong3]);

        return { question: question, answer: answer, options: possibleOptions };
    },

    tutorialTitle: "How to simplify Ratios",
    sections: [
        Section("Find HCF", "HCF stands for Highest Common Factor, it is the highest factor which both numbers can divide by and remain a whole number."),
        Section("Divide by HCF", "Once you have found the HCF, you can find the simplifyed ratio by just divide both sides by the HCF.")
    ]
}