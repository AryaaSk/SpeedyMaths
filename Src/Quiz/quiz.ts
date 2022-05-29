//Generating Question Callbacks
const QUIZ_LENGTH = 10;
const INCORRECT_ANSWER_TIME_PENALTY_MS = 5000;

const InitHTML = () => {
    //@ts-expect-error
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
    //@ts-expect-error
    const quizTitle = params.title;

    document.getElementById("title")!.innerText = quizTitle;
}

const CreateQuestions = () => {
    //@ts-expect-error
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
    //@ts-expect-error
    const quizType = params.type;

    const questions: Question[] = [];
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
}

const DoQuestion = (question: Question) => {
    let wrong = 0;
    const promise = new Promise((resolve) => {
        document.getElementById("question")!.innerText = question.question;
        document.getElementById("option1")!.innerText = String(question.options[0]);
        document.getElementById("option2")!.innerText = String(question.options[1]);
        document.getElementById("option3")!.innerText = String(question.options[2]);
        document.getElementById("option4")!.innerText = String(question.options[3]);

        document.getElementById("option1")!.style.color = "var(--fontColour)";
        document.getElementById("option2")!.style.color = "var(--fontColour)";
        document.getElementById("option3")!.style.color = "var(--fontColour)";
        document.getElementById("option4")!.style.color = "var(--fontColour)";

        document.getElementById("option1")!.onclick = () => { clickedAnswer(0); }
        document.getElementById("option2")!.onclick = () => { clickedAnswer(1); }
        document.getElementById("option3")!.onclick = () => { clickedAnswer(2); }
        document.getElementById("option4")!.onclick = () => { clickedAnswer(3); }

        const clickedAnswer = (index: number) => { //resolves true if the answer was correct, false is the answer was wrong
            if (question.options[index] == question.answer) {
                resolve(wrong);
            }
            else {
                //choice was not correct, so don't move on and highlight option red
                document.getElementById("option" + (index + 1))!.style.color = "red";
                setTimeout(() => { document.getElementById("option" + (index + 1))!.style.color = "var(--fontColour)"; }, 2000);
                wrong += 1;
            }
        }
    });
    return promise;
}

const DoQuiz = async (questions: Question[]) => {
    let totalWrong: any = 0;
    for (const question of questions) {
        const wrong = await DoQuestion(question);
        totalWrong += wrong;
    }
    return totalWrong;
}


const MAIN_QUIZ = async () => {
    InitHTML();
    const startTime = Date.now();
    const questions = CreateQuestions();
    const totalWronglyAnswered = await DoQuiz(questions);
    const endTime = Date.now();

    const timeTaken = ((endTime - startTime) + (totalWronglyAnswered * INCORRECT_ANSWER_TIME_PENALTY_MS)) / 1000; //seconds
    console.log(timeTaken);
    //show done button which takes user back to their previous screen
}

MAIN_QUIZ();