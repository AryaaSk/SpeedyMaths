let USER_ID: string;
let USERNAME: string;
let PARTY_CODE: number;

const GetUser = (): string[] => {
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
        return [userID, username!];
    }
}

const SyncFirebase = async () => {
    //Check if the user already has a node in the Players list in firebase, if not then create one
    const currentPartyCode = await FirebaseRead("Players/" + USER_ID + "/currentPartyCode");
    PARTY_CODE = (<number>currentPartyCode);

    if (currentPartyCode == undefined) {
        FirebaseWrite("Players/" + USER_ID, {
            currentPartyCode: -1
        })
    }

    const party = await FirebaseRead("Parties/" + PARTY_CODE);
    if (party == undefined || (<any>party).gameStarted == true) {
        FirebaseWrite("Players/" + USER_ID, { currentPartyCode: -1 })
    }
}
const PartyCodeCallback = (data: number) => {
    if (data != PARTY_CODE) {
        location.reload(); //So now whenever the user is placed into a party, the page will reload and we don't always have to worry about the user switching parties
    }
}


const InitHTML = () => {
    document.getElementById("username")!.innerText = USERNAME;
    if (PARTY_CODE == -1) { //user is not inside a party
        document.getElementById("currentPartyCode")!.style.display = "none";
    }
    else {
        document.getElementById("createParty")!.style.display = "none";
        document.getElementById("enterCode")!.style.display = "none";

        document.getElementById("currentPartyCode")!.style.display = "block";
        document.getElementById("leaveParty")!.style.display = "block";
        document.getElementById("currentPartyCode")!.innerText = "Current Party Code: " + String(PARTY_CODE);
    }
}

const CreateParty = async () => {
    const range = [100000, 999999]; //random 6 digit number
    const offset = Math.round((Math.random() * (range[1] - range[0])));
    const code = range[0] + offset;

    const playerTime: { [k: string] : any } = {};
    playerTime[USER_ID] = 0;

    await FirebaseWrite("Parties/" + code, {
        gameStarted: false,
        playerTimes: playerTime
    });
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", code);
}

const JoinParty = async (code: number) => {
    const party = await FirebaseRead("Parties/" + code);

    if (party == undefined) { //check if party exists
        alert("Invalid Party Code");
        return;
    }
    else if ((<any>party).gameStarted == true) {
        alert("Unable to join: Game has already started");
        return;
    }

    //Add the USER_ID to the playerTimes list
    await FirebaseWrite("Parties/" + code + "/playerTimes/" + USER_ID, 0);
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", code);
}

const LeaveParty = async () => {
    await FirebaseRemove("Parties/" + PARTY_CODE + "/playerTimes/" + USER_ID);
    const partyPlayers = await FirebaseRead("Parties/" + PARTY_CODE + "/playerTimes");
    console.log(partyPlayers);

    if (partyPlayers == null) { //party does not have any other players in it
        await FirebaseRemove("Parties/" + PARTY_CODE);
    }
    FirebaseWrite("Players/" + USER_ID + "/currentPartyCode", -1);
}

const InitListeners = () => {
    document.getElementById("createParty")!.onclick = () => {
        CreateParty();
    }
    document.getElementById("joinParty")!.onclick = () => {
        const code = Number((<HTMLInputElement>document.getElementById("enterCodeInput")!).value);
        JoinParty(code);
    }
    document.getElementById("leaveParty")!.onclick = () => {
        LeaveParty();
    }
}


const MAIN_MULTIPLAYER = async () => {
    [USER_ID, USERNAME] = GetUser();
    await SyncFirebase();
    FirebaseListener("Players/" + USER_ID + "/currentPartyCode", PartyCodeCallback);

    //After this point, PARTY_CODE will remain constant
    InitHTML();
    InitListeners();
}

MAIN_MULTIPLAYER();