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
let USER_ID;
let USERNAME;
let PARTY_CODE;
let QUIZ_TIME = undefined;
//DOM MANIPULTION
const InitHTML = () => {
    document.getElementById("username").value = USERNAME;
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    document.getElementById("title").innerText = title;
    if (PARTY_CODE == -1) { //user is not inside a party
        document.getElementById("currentPartyCode").style.display = "none";
    }
    else {
        document.getElementById("goBack").style.display = "none";
        document.getElementById("createParty").style.display = "none";
        document.getElementById("enterCode").style.display = "none";
        document.getElementById("currentPartyCode").style.display = "block";
        document.getElementById("leaveParty").style.display = "block";
        document.getElementById("currentPartyCode").innerText = "Current Party Code: " + String(PARTY_CODE);
        document.getElementById("gameControl").style.display = "block";
        document.getElementById("startGame").style.display = "block";
        if (QUIZ_TIME != undefined) {
            document.getElementById("startGame").style.display = "none";
        }
    }
};
const InitListeners = () => {
    document.getElementById("goBack").onclick = () => {
        const url = "/Src/Home/home.html";
        location.href = url;
    };
    document.getElementById("username").onclick = () => {
        const newUsername = prompt("Enter a new username");
        if (newUsername == undefined || newUsername == "") {
            return;
        }
        ChangeUsername(newUsername);
    };
    document.getElementById("createParty").onclick = () => {
        CreateParty();
    };
    document.getElementById("joinParty").onclick = () => {
        const code = Number(document.getElementById("enterCodeInput").value);
        JoinParty(code);
    };
    document.getElementById("leaveParty").onclick = () => {
        LeaveParty();
    };
    document.getElementById("startGame").onclick = () => {
        StartGame();
    };
};
function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0], param, params_arr = [], queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length)
            rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}
//FIREBASE FUNCTIONS
const GetUser = () => {
    //check local storage for a user id, if there isnt one then we create one, there should also be a username stored in local storage
    const userID = localStorage.getItem("userID");
    if (userID == undefined) {
        const generatedUserID = String(Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1) + 1000000000000000));
        const username = "SpeedyMathsPlayer";
        localStorage.setItem("userID", generatedUserID);
        localStorage.setItem("username", username);
        return [generatedUserID, username];
    }
    else {
        const username = localStorage.getItem("username");
        return [userID, username];
    }
};
const ChangeUsername = (username) => {
    USERNAME = username;
    localStorage.setItem("username", username);
    FirebaseWrite("Players/" + USER_ID + "/username", username);
    document.getElementById("username").value = USERNAME;
};
const UpdateFirebase = () => __awaiter(void 0, void 0, void 0, function* () {
    //Check if the user already has a node in the Players list in firebase, if not then create one
    const playerNode = yield FirebaseRead("Players/" + USER_ID);
    if (playerNode == undefined) {
        FirebaseWrite("Players/" + USER_ID, {
            currentPartyCode: -1,
            username: USERNAME
        });
        PARTY_CODE = -1;
    }
    else {
        const currentPartyCode = yield FirebaseRead("Players/" + USER_ID + "/currentPartyCode");
        PARTY_CODE = currentPartyCode;
        const party = yield FirebaseRead("Parties/" + PARTY_CODE);
        if (party == undefined) {
            FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", -1);
        }
    }
});
const PartyCodeCallback = (data) => {
    let removedTime = removeParam("time", location.href);
    if (removedTime.endsWith("&")) {
        removedTime = removedTime.slice(0, -1);
    }
    if (data != PARTY_CODE) {
        location.href = removedTime;
    }
};
const UpdateQuizTime = () => {
    if (PARTY_CODE == -1) {
        return;
    }
    FirebaseWrite("Parties/" + PARTY_CODE + "/playerTimes/" + USER_ID, QUIZ_TIME);
};
//MANAGING PARTIES
const CreateParty = () => __awaiter(void 0, void 0, void 0, function* () {
    const range = [100000, 999999]; //random 6 digit number
    const offset = Math.round((Math.random() * (range[1] - range[0])));
    const code = range[0] + offset;
    const playerTime = {};
    playerTime[USER_ID] = 0;
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get('type');
    yield FirebaseWrite("Parties/" + code, {
        gameStarted: false,
        gameType: gameType,
        playerTimes: playerTime
    });
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", code);
});
const JoinParty = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get('type');
    const party = yield FirebaseRead("Parties/" + code);
    if (party == undefined) { //check if party exists
        alert("Invalid Party Code");
        return;
    }
    else if (party.gameStarted == true) {
        alert("Unale to join: Game has already started");
        return;
    }
    else if (party.gameType != gameType) {
        alert("Unable to join: Party is for game type of: " + party.gameType);
        return;
    }
    //Add the USER_ID to the playerTimes list
    yield FirebaseWrite("Parties/" + code + "/playerTimes/" + USER_ID, 0);
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", code);
});
const LeaveParty = () => __awaiter(void 0, void 0, void 0, function* () {
    yield FirebaseRemove("Parties/" + PARTY_CODE + "/playerTimes/" + USER_ID);
    const partyPlayers = yield FirebaseRead("Parties/" + PARTY_CODE + "/playerTimes");
    console.log(partyPlayers);
    if (partyPlayers == null) { //party does not have any other players in it
        yield FirebaseRemove("Parties/" + PARTY_CODE);
    }
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", -1); //forces a page reload as well, therefore removing the listener
});
const StartGame = () => {
    if (PARTY_CODE == -1) {
        return;
    }
    FirebaseWrite("Parties/" + PARTY_CODE + "/gameStarted", true); //should trigger the GameStartedCallback
};
//LOBBY MANAGEMENT
const UpdatePartyPlayers = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const playersList = document.getElementById("playerList");
    playersList.innerHTML = "";
    for (const userID in data) {
        //Get the player's username from their key
        const username = yield FirebaseRead("Players/" + userID + "/username");
        const timeTaken = data[userID];
        const listElement = document.createElement("li");
        listElement.innerText = `${String(username)} : ${timeTaken}s`;
        playersList.append(listElement);
    }
});
const GameStartedCallback = (data) => {
    if (data != true) {
        return;
    }
    //Once you are past this point, then we know that the game has been started so the player must be transported to the quiz, and then we will see them again when they get sent back from the quiz
    TransportPlayer();
};
const TransportPlayer = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameType = urlParams.get('type');
    const gameTitle = urlParams.get('title');
    const url = `/Src/Quiz/quiz.html?type=${gameType}&&title=${gameTitle}&&gameType=multiplayer`;
    location.href = url;
};
const MAIN_MULTIPLAYER = () => __awaiter(void 0, void 0, void 0, function* () {
    [USER_ID, USERNAME] = GetUser();
    const urlParams = new URLSearchParams(window.location.search);
    const quizTimeString = urlParams.get('time'); //if this is not undefined then it means the user has just come back from a quiz
    if (quizTimeString == null) {
        QUIZ_TIME = undefined;
    }
    else {
        QUIZ_TIME = Number(quizTimeString);
    }
    yield UpdateFirebase();
    FirebaseListen("Players/" + USER_ID + "/currentPartyCode", PartyCodeCallback);
    if (QUIZ_TIME != undefined) {
        UpdateQuizTime();
    }
    //After this point, PARTY_CODE remains constant, since whenever it changes the page will be refreshed
    InitHTML();
    InitListeners();
    if (PARTY_CODE != -1) {
        //After joining a party, we need to listen to whenever another player joins, so setup a listener which updates everytime the Parties PlayerTimes is updated
        FirebaseListen("Parties/" + PARTY_CODE + "/playerTimes", UpdatePartyPlayers);
        if (QUIZ_TIME == undefined) {
            FirebaseListen("Parties/" + PARTY_CODE + "/gameStarted", GameStartedCallback); //listen to gameStarted key, but only if the user has not done the quiz yet
        }
    }
});
MAIN_MULTIPLAYER();
