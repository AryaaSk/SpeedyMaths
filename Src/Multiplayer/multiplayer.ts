//USER_ID and USERNAME variables have already been declared in firebase.ts

const InitMultiplayer = () => {
    document.getElementById("username")!.innerText = USERNAME;

    //check if the user is inside a party (from firebase), if so then show the CurrentPartyCode label and hide the EnterCode button, otherwise show the create party button
}

const MAIN_MULTIPLAYER = () => {
    InitMultiplayer();
}

MAIN_MULTIPLAYER();