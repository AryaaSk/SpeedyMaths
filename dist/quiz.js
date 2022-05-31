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
const QUIZ_LENGTH = 2;
const INCORRECT_ANSWER_TIME_PENALTY_MS = 5000;
let WRONGLY_ANSWERED = 0;
const InitQuiz = () => {
    WRONGLY_ANSWERED = 0;
    //@ts-expect-error
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
    //@ts-expect-error
    const quizTitle = params.title;
    document.getElementById("title").innerText = quizTitle;
    document.getElementById("option1").style.display = "grid";
    document.getElementById("option2").style.display = "grid";
    document.getElementById("option3").style.display = "grid";
    document.getElementById("option4").style.display = "grid";
    document.getElementById("timeTaken").style.display = "none";
    document.getElementById("doneButton").style.display = "none";
};
const CreateQuestions = () => {
    //@ts-expect-error
    const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
    //@ts-expect-error
    const quizType = params.type;
    const questions = [];
    for (let i = 0; i != QUIZ_LENGTH; i += 1) {
        const question = QUESTIONS[quizType]();
        questions.push(question);
    }
    return questions;
};
const DoQuestion = (question) => {
    const promise = new Promise((resolve) => {
        document.getElementById("question").innerText = question.question;
        document.getElementById("option1").innerText = String(question.options[0]);
        document.getElementById("option2").innerText = String(question.options[1]);
        document.getElementById("option3").innerText = String(question.options[2]);
        document.getElementById("option4").innerText = String(question.options[3]);
        document.getElementById("option1").style.backgroundColor = "";
        document.getElementById("option2").style.backgroundColor = "";
        document.getElementById("option2").style.backgroundColor = "";
        document.getElementById("option3").style.backgroundColor = "";
        document.getElementById("option1").onclick = () => { clickedAnswer(0); };
        document.getElementById("option2").onclick = () => { clickedAnswer(1); };
        document.getElementById("option3").onclick = () => { clickedAnswer(2); };
        document.getElementById("option4").onclick = () => { clickedAnswer(3); };
        const clickedAnswer = (index) => {
            if (question.options[index] == question.answer) {
                resolve(true);
            }
            else {
                //choice was not correct, so don't move on and highlight option red
                document.getElementById("option" + (index + 1)).style.backgroundColor = "#ff6161";
                setTimeout(() => { document.getElementById("option" + (index + 1)).style.backgroundColor = ""; }, 2000);
                WRONGLY_ANSWERED += 1;
            }
        };
    });
    return promise;
};
const DoQuiz = (questions) => __awaiter(void 0, void 0, void 0, function* () {
    for (const question of questions) {
        yield DoQuestion(question);
    }
});
const UpdateTimerLoop = (startTime) => __awaiter(void 0, void 0, void 0, function* () {
    const timer = document.getElementById("timer");
    const interval = setInterval(() => {
        const currentDate = Date.now();
        const timeTaken = ((currentDate - startTime) + (WRONGLY_ANSWERED * INCORRECT_ANSWER_TIME_PENALTY_MS)) / 1000; //seconds
        const timeTakenStringSplit = String(timeTaken).split("."); //we always want there to be 3 decimal points to not confuse the user
        let values = timeTakenStringSplit[0];
        let decimals = timeTakenStringSplit[1];
        while (decimals.length < 3) {
            decimals = decimals + "0";
        }
        timer.innerText = `${values}.${decimals}s`;
    }, 16);
    return interval;
});
const FinishQuiz = (timeTaken) => {
    document.getElementById("question").innerText = "Completed";
    document.getElementById("option1").style.display = "none";
    document.getElementById("option2").style.display = "none";
    document.getElementById("option3").style.display = "none";
    document.getElementById("option4").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.getElementById("timeTaken").style.display = "grid"; //since I use that to center the text
    document.getElementById("doneButton").style.display = "block";
    document.getElementById("timeTaken").innerText = `Time: ${timeTaken}s`;
    document.getElementById("doneButton").onclick = () => {
        //@ts-expect-error
        const params = new Proxy(new URLSearchParams(window.location.search), { get: (searchParams, prop) => searchParams.get(prop), });
        //@ts-expect-error
        const gameType = params.gameType;
        if (gameType == "singlePlayer") {
            location.href = "home.html";
        }
        else if (gameType == "multiplayer") {
            const urlParams = new URLSearchParams(window.location.search);
            const type = urlParams.get('type');
            const title = urlParams.get('title');
            location.href = `multiplayer.html?type=${type}&&title=${title}&&time=${timeTaken}`;
        }
    };
};
const MAIN_QUIZ = () => __awaiter(void 0, void 0, void 0, function* () {
    InitQuiz();
    const startTime = Date.now();
    const questions = CreateQuestions();
    const timerInterval = yield UpdateTimerLoop(startTime); //returns a reference to the setInterval(), so we can clear it later
    yield DoQuiz(questions);
    const endTime = Date.now();
    clearInterval(timerInterval);
    const timeTaken = ((endTime - startTime) + (WRONGLY_ANSWERED * INCORRECT_ANSWER_TIME_PENALTY_MS)) / 1000; //seconds
    FinishQuiz(timeTaken);
});
MAIN_QUIZ();
