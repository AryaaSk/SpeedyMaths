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
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.set(data).then(() => { resolve("Added data"); });
    });
    return promise;
};
const FirebasePush = (path, data) => {
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.push(data).then(() => { resolve("Appened data"); });
    });
    return promise;
};
const FirebaseRemove = (path) => {
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.remove().then(() => { resolve("Removed data"); });
    });
    return promise;
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
const FirebaseListener = (path, callback) => {
    const ref = firebase.database().ref(path);
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
};
