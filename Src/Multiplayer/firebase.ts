declare const firebase: any;

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
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.set(data).then(() => { resolve("Added data"); });
    })
    return promise;
};

const FirebasePush = (path: string, data: any) => { //DOESN'T WORK PROPERLY, IT KEEPS ADDING SOME RANDOM CHARACTERS
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.push(data).then(() => { resolve("Appened data"); });
    })
    return promise;
};

const FirebaseRemove = (path: string) => {
    const promise = new Promise((resolve) => {
        const ref = firebase.database().ref(path);
        ref.remove().then(() => { resolve("Removed data"); })
    })
    return promise;
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

const FirebaseListen = (path: string, callback: (data: any) => void) => {
    const ref = firebase.database().ref(path);
    ref.on('value', (snapshot: any) => {
        const data = snapshot.val();
        callback(data);
    });
};