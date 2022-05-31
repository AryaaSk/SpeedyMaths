interface Tutorial {
    title: string,
    sections: {
        subtitle: string
        content: string,
    }[]
}

let TUTORIAL: Tutorial = { title: "", sections: [] };
const GetTutorial = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type')!;

    TUTORIAL.title = GAME_MODES[type].tutorialTitle;
    TUTORIAL.sections = GAME_MODES[type].sections;
}


const InitTutorial = () => {
    document.getElementById("title")!.innerText = TUTORIAL.title;
    for (const section of TUTORIAL.sections) {
        console.log(section);
    }
}


const MAIN_TUTORIAL = () => {
    GetTutorial();
    InitTutorial();
}

MAIN_TUTORIAL();