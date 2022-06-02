"use strict";
let TUTORIAL = { title: "", sections: [] };
const GetTutorial = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    TUTORIAL.title = GAME_MODES[type].tutorialTitle;
    TUTORIAL.sections = GAME_MODES[type].sections;
};
const InitTutorial = () => {
    document.getElementById("title").innerText = TUTORIAL.title;
    const contents = document.getElementById("contents");
    contents.innerHTML = "";
    for (const section of TUTORIAL.sections) {
        const sectionElement = document.createElement("div");
        sectionElement.className = "section";
        const subtitleElement = document.createElement("h2");
        subtitleElement.className = "subtitle";
        subtitleElement.innerText = section.subtitle;
        const contentElement = document.createElement("p");
        contentElement.className = "content";
        contentElement.innerText = section.content;
        sectionElement.append(subtitleElement);
        sectionElement.append(contentElement);
        contents.append(sectionElement);
    }
    document.getElementById("goBack").onclick = () => {
        const url = "/Src/Home/home.html";
        location.href = url;
    };
};
const MAIN_TUTORIAL = () => {
    GetTutorial();
    InitTutorial();
};
MAIN_TUTORIAL();
