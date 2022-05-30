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
//Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8oxUMbZuyO98AoWTNE_7GYgRVXL_iIk8",
    authDomain: "speedymaths-b7f6e.firebaseapp.com",
    databaseURL: "https://speedymaths-b7f6e-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "speedymaths-b7f6e",
    storageBucket: "speedymaths-b7f6e.appspot.com",
    messagingSenderId: "70698617610",
    appId: "1:70698617610:web:ce4362c97ceb4ef9c3c8f3"
};
firebase.initializeApp(firebaseConfig);
const DATABASE = firebase.database();
const FirebaseWrite = (path, data) => {
    const ref = firebase.database().ref(path);
    ref.set(data);
};
const FirebaseRead = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.once('value').then((snapshot) => {
            const data = snapshot.val();
            resolve(data);
        });
    });
    return promise;
});
//User Managment
const GetUser = () => {
    //check local storage for a user id, if there isnt one then we create one, there should also be a username stored in local storage
    const userID = localStorage.getItem("userID");
    const username = localStorage.getItem("username");
    if (userID == undefined) {
        const generatedUserID = String(Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1) + 1000000000000000));
        localStorage.setItem("userID", generatedUserID);
        localStorage.setItem("username", "SpeedyMathsPlayer");
        return [generatedUserID, "SpeedyMathsPlayer"];
    }
    else {
        return [userID, username];
    }
};
const MAIN_FIREBASE = () => __awaiter(void 0, void 0, void 0, function* () {
    [USER_ID, USERNAME] = GetUser();
});
MAIN_FIREBASE();
