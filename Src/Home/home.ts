const CSSSetup = () => {
    //Add grid columns to the Activity Grid
    const activityWidth = Number(getComputedStyle(document.body).getPropertyValue('--activityWidth').slice(0, -2));
    const gridColumns = Math.floor(window.innerWidth / activityWidth);
    const repeatProperty = `repeat(${gridColumns}, ${activityWidth}px);`
    document.getElementById("activityGrid")!.style.gridTemplateColumns = repeatProperty; //NOT WORKING PROPERLY AT THE MOMENT, CSS ISN'T UPDATING
}

interface Activity {
    type: string, //lowercase
    title: string,
    image: string, //e.g. Addition for Addition.svg
    imageColour: string,
    imageHeight: string
}
const ACTIVITIES: Activity[] = [
    { type: "addition", title: "Addition", image: "Addition", imageColour: "#123456", imageHeight: "70%" },
    { type: "subtraction", title: "Subtraction", image: "Subtraction", imageColour: "#123456", imageHeight: "20%" },
    { type: "multiplication", title: "Multiplication", image: "Multiplication", imageColour: "#123456", imageHeight: "70%" },
    { type: "division", title: "Division", image: "Division", imageColour: "#123456", imageHeight: "70%" },
    { type: "algebra", title: "Algebra", image: "Algebra", imageColour: "#123456", imageHeight: "70%" }
]
const LoadActivities = () => {
    const activityGrid = document.getElementById("activityGrid")!;
    activityGrid.innerHTML = "";
    
    for (const activity of ACTIVITIES) {
        const element = document.createElement("activity");
        element.dataset["type"] = activity.type;
        element.innerHTML = 
        `
            <div>
                <h2>${activity.title}</h2>
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

const InitListeners = () => {
    const elements = document.getElementsByTagName("activity");
    for (const element of elements) {
        const type = (<HTMLElement>element).dataset["type"];
        (<HTMLElement>element).onclick = () => {
            const url = `/Src/multiplayer?type=${type}`
            console.log("Go to: " + url);
        }
    }
}

const main = () => {
    CSSSetup();
    LoadActivities();
    LoadSVGs();
    InitListeners();
}

main();