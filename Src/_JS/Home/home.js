"use strict";
let DISPLAYED_GAME_MODES = [];
const GetGameModes = () => {
    const DisplayedGameModes = [];
    for (const type in GAME_MODES) {
        DisplayedGameModes.push({
            type: type,
            title: GAME_MODES[type].displayTitle,
            image: GAME_MODES[type].displayImage,
            imageColour: GAME_MODES[type].imageColour,
            imageHeight: GAME_MODES[type].imageHeight
        });
    }
    return DisplayedGameModes;
};
//Problem where grid is broken, appears to come from this function, where it keeps on making the --activityWidth 0px, and therefore breaking the grid
const ResizeGrid = () => {
    //Add grid columns to the Activity Grid
    let activityWidth = Number(getComputedStyle(document.body).getPropertyValue('--activityWidth').slice(0, -2));
    if (activityWidth == 0 || activityWidth == undefined) {
        activityWidth = 350; //safe guard
    }
    let gridColumns = Math.floor((window.innerWidth - 300) / activityWidth);
    if (gridColumns > DISPLAYED_GAME_MODES.length) {
        gridColumns = DISPLAYED_GAME_MODES.length;
    }
    let repeatProperty = `repeat(${gridColumns}, ${activityWidth}px)`;
    document.getElementById("activityGrid").style.gridTemplateColumns = repeatProperty; //NOT WORKING PROPERLY AT THE MOMENT, CSS ISN'T UPDATING
};
const LoadGameModes = () => {
    const activityGrid = document.getElementById("activityGrid");
    activityGrid.innerHTML = "";
    for (const activity of DISPLAYED_GAME_MODES) {
        const element = document.createElement("div");
        element.id = activity.type;
        element.className = "activity";
        element.dataset["type"] = activity.type;
        element.innerHTML =
            `
            <div>
                <h2 class="activityTitle">${activity.title}</h2>
            </div>
            <div style='height: 100%; width: 100%; display: flex; align-items: center; justify-content: center;'>
                <img data-src="${activity.image}" data-colour="${activity.imageColour}" data-height="${activity.imageHeight}">
            </div>
        `;
        activityGrid.append(element);
    }
};
const LoadSVGs = () => {
    const images = document.getElementsByTagName('img');
    for (const image of images) {
        const name = image.dataset["src"]; //get image name from data attributes
        const hex = image.dataset["colour"].replace("#", "");
        const height = image.dataset["height"];
        //get svg file from assets folder
        fetch(`/Assets/${name}.svg`).then((response) => {
            response.text().then((text) => {
                const lines = text.split("\n");
                let i = 0; //remove code injected by live-server
                while (i != lines.length) {
                    if (lines[i] == "<!-- Code injected by live-server -->") {
                        while (lines[i] != "</script>") {
                            lines.splice(i, 1);
                        }
                        lines.splice(i, 1); //to remove the "</script>"
                    }
                    else {
                        //change first line's width and height
                        if (lines[i].startsWith("<svg")) {
                            const div = document.createElement('div'); //parsing the lines[0] string into a html element
                            div.innerHTML = lines[i];
                            const svgSetup = div.children[0];
                            svgSetup.setAttribute('height', height); //changing height, width is proportional to width so it doesn't need its own value
                            svgSetup.removeAttribute('width');
                            const svgSetupString = svgSetup.outerHTML.slice(0, -6); //remove the </svg> at the end
                            lines[i] = svgSetupString; //merge back into lines[i]
                        }
                        //find a '#', since it is only used in hex codes, and change the next 6 digits to the colour requested to change fill
                        const hastagIndex = lines[i].indexOf("#");
                        if (hastagIndex != -1) {
                            //convert lines[i] to a list so we can modify substrings
                            const svgLineList = [...lines[i]];
                            svgLineList[hastagIndex + 1] = hex[0];
                            svgLineList[hastagIndex + 2] = hex[1];
                            svgLineList[hastagIndex + 3] = hex[2];
                            svgLineList[hastagIndex + 4] = hex[3];
                            svgLineList[hastagIndex + 5] = hex[4];
                            svgLineList[hastagIndex + 6] = hex[5];
                            const svgLine = svgLineList.join(""); //merge back into original lines array
                            lines[i] = svgLine;
                        }
                        i += 1;
                    }
                }
                const svg = lines.join("\n"); //change the image from <img> to an <svg> element
                image.outerHTML = svg;
            });
        });
    }
};
const LoadListeners = () => {
    const searchBar = document.getElementById("searchBar");
    searchBar.oninput = () => {
        DISPLAYED_GAME_MODES = GetGameModes();
        const searchText = searchBar.value.toLowerCase();
        if (searchText == null || searchText == "") {
            LoadDOM();
            return;
        }
        //filter the gameModes in DISPLAYED_GAME_MODES, only the ones which match the searchText
        let i = 0;
        while (i != DISPLAYED_GAME_MODES.length) {
            const title = DISPLAYED_GAME_MODES[i].title.toLowerCase();
            if (title.includes(searchText) == false) { //remove from list if the title does not include the search term
                DISPLAYED_GAME_MODES.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
        LoadDOM(); //redraw DOM after changing DISPLAYED_GAME_MODES
    };
    for (const gameMode of DISPLAYED_GAME_MODES) {
        const type = gameMode.type;
        document.getElementById(type).onclick = () => {
            OpenPopup(gameMode);
        };
    }
    document.getElementById("popupBackground").onclick = () => {
        ClosePopup();
    };
};
const OpenPopup = (gameMode) => {
    document.getElementById("popup").style.bottom = "0";
    document.getElementById("popupTitle").innerText = gameMode.title;
    document.getElementById("tutorial").onclick = () => {
        const url = `/Src/Tutorial/tutorial.html?type=${gameMode.type}`;
        location.href = url;
    };
    document.getElementById("singlePlayer").onclick = () => {
        const url = `/Src/Quiz/quiz.html?type=${gameMode.type}&&title=${gameMode.title}&&gameType=singlePlayer`;
        location.href = url;
    };
    document.getElementById("multiplayer").onclick = () => {
        const url = `/Src/Multiplayer/multiplayer.html?type=${gameMode.type}&&title=${gameMode.title}`;
        location.href = url;
    };
};
const ClosePopup = () => {
    document.getElementById("popup").style.bottom = "-100vh";
};
const LoadDOM = () => {
    LoadGameModes();
    LoadSVGs();
    LoadListeners();
};
const MAIN_HOME = () => {
    DISPLAYED_GAME_MODES = GetGameModes();
    LoadDOM();
    ResizeGrid();
    document.body.onresize = () => { ResizeGrid(); };
};
MAIN_HOME();
