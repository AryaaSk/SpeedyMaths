const ResizeGrid = () => {
    //Add grid columns to the Activity Grid
    const activityWidth = Number(getComputedStyle(document.body).getPropertyValue('--activityWidth').slice(0, -2));
    let gridColumns = Math.floor((window.innerWidth - 150) / activityWidth);
    if (gridColumns > ACTIVITIES.length) {
        gridColumns = ACTIVITIES.length;
    }
    let repeatProperty = `repeat(${gridColumns}, ${activityWidth}px)`
    document.getElementById("activityGrid")!.style.gridTemplateColumns = repeatProperty; //NOT WORKING PROPERLY AT THE MOMENT, CSS ISN'T UPDATING
}

interface ActivityType {
    type: string, //lowercase
    title: string,
    image: string, //e.g. Addition for Addition.svg
    imageColour: string,
    imageHeight: string
}
const Activity = (type: string, title: string, image: string, imageHeight?: string, imageColour?: string) => {
    if (imageColour == undefined) {
        imageColour = ACTIVITY_COLOUR;
    }
    if (imageHeight == undefined) {
        imageHeight = "70%";
    }

    return { type: type, title: title, image: image, imageColour: imageColour, imageHeight: imageHeight };
}

const ACTIVITY_COLOUR = "#123456";
const ACTIVITIES: ActivityType[] = [
    Activity("addition", "Addition", "Addition"),
    Activity("subtraction", "Subtraction", "Subtraction", "20%"),
    Activity("multiplication", "Multiplication", "Multiplication"),
    Activity("division", "Division", "Division"),
    Activity("squareNumbers", "Square Numbers", "XSquared"),
    Activity("squareRoots3Digits", "Square Roots (2 - 3 digits)", "SquareRoot", "60%"),
    Activity("squareRoots4Digits", "Square Roots (4 digits)", "SquareRoot", "60%")
]

const LoadActivities = () => {
    const activityGrid = document.getElementById("activityGrid")!;
    activityGrid.innerHTML = "";
    
    for (const activity of ACTIVITIES) {
        const element = document.createElement("div");
        element.id = activity.type;
        element.className = "activity"
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
}

const LoadSVGs = () => {
    const images = document.getElementsByTagName('img')!;
    for (const image of images) {
        const name = image.dataset["src"]; //get image name from data attributes
        const hex = image.dataset["colour"]!.replace("#", "");
        const height = image.dataset["height"]!;
        
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
                            div.innerHTML= lines[i];
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
                            lines[i] = svgLine
                        }

                        i += 1;
                    }
                }

                const svg = lines.join("\n"); //change the image from <img> to an <svg> element
                image.outerHTML = svg;
            })
        })
    }
}

const LoadListeners = () => {
    for (const activity of ACTIVITIES) {
        const type = activity.type;
        
        document.getElementById(type)!.onclick = () => {
            OpenPopup(activity);
        }
    }

    document.getElementById("popupBackground")!.onclick = () => {
        ClosePopup();
    }
}

const OpenPopup = (activity: ActivityType) => {
    document.getElementById("popup")!.style.bottom = "0"

    document.getElementById("popupTitle")!.innerText = activity.title;
    document.getElementById("tutorial")!.onclick = () => {
        console.log("Go to tutorial for: " + activity.type);
    }
    document.getElementById("singlePlayer")!.onclick = () => {
        const url = `/Src/Quiz/quiz.html?type=${activity.type}&&title=${activity.title}&&gameType=singlePlayer`
        location.href = url;
    }
    document.getElementById("multiplayer")!.onclick = () => {
        const url = `/Src/Multiplayer/multiplayer.html?type=${activity.type}&&title=${activity.title}`;
        location.href = url;
    }
}
const ClosePopup = () => {
    document.getElementById("popup")!.style.bottom = "-100vh"
}

const MAIN_HOME = () => {
    ResizeGrid();
    document.body.onresize = () => { ResizeGrid(); }

    LoadActivities();
    LoadSVGs();
    LoadListeners();
}

MAIN_HOME();