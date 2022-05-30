declare const firebase: any;
let USER_ID: string;
let USERNAME: string;

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


const FirebaseWrite = (path: string, data: any) => {
    const ref = firebase.database().ref(path);
    ref.set(data);
};
const FirebaseRead = async (path: string) => {
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.once('value').then((snapshot: any) => {
            const data = snapshot.val();
            resolve(data);
        });
    })
    return promise;
};



//User Managment
const GetUser = (): string[] => {
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
        return [userID, username!];
    }
}



const MAIN_FIREBASE = async () => {
    [USER_ID, USERNAME] = GetUser();
}

MAIN_FIREBASE();