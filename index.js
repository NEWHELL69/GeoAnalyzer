const axios = require('axios')

const fs = require('fs');

const filePathTxt = './example.txt';

function writeToTxtFile(filePathTxt, content) {
    fs.writeFile(filePathTxt, content, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('Content written to file successfully.');
      }
    });
  }

function appendPOJOtoJSON(newPOJO, filePath) {
    // Read the existing JSON content from the file
    let existingData = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(fileContent);
    } catch (error) {
        // Handle file not found or invalid JSON
        console.error(`Error reading or parsing file ${filePath}: ${error.message}`);
        return;
    }

    // Append the new POJO to the existing data
    existingData = existingData.concat(newPOJO);

    // Convert the updated data to a JSON string
    const updatedJsonString = JSON.stringify(existingData, null, 2);

    // Write the updated JSON string back to the file
    fs.writeFileSync(filePath, updatedJsonString, 'utf-8');

    console.log(`POJO has been appended to ${filePath}`);
}

const filePath = './data.json';

const precison = (number) => {
    return Number.parseFloat(number.toFixed(6));
}

const findStepsBtwPoints = (y1, x1, y2, x2, steps) => {
    let direction = y1 < y2 ? true : false;

    if(y1 === y2){
        direction = x1 < x2 ? true : false;
    }

    let m;

    if(x2 === x1) {
        m = 360;
    } else {
        m = (y2-y1)/(x2-x1);
    }

    const comparison = y1 === y2 ? () => (x1 < x2 ?  true : false) : () => (direction ? (y1 < y2 ? true : false) : (y1 > y2 ? true : false));

    const list = [{x: x1, y: y1, m: m}];
    let a, b, d;
    const c = y2 - (m*x2);

    while(comparison()) {
        a = Math.pow(m, 2) + 1;
        b = (2*m*c) - (2*m*y1) - (2*x1);
        d = -(Math.pow(steps, 2) - Math.pow(y1, 2) - Math.pow(x1, 2) - Math.pow(c, 2) + (2*y1*c));

        if(m < 0 ? !direction : direction) {
            x1 = precison(((-b) + Math.pow((Math.pow(b, 2) - (4*a*d)), 1/2))/(2*a));
            y1 = precison((m*x1) + c);
            list.push({x: x1, y: y1});
        } else {
            x1 = precison(((-b) - Math.pow((Math.pow(b, 2) - (4*a*d)), 1/2))/(2*a));
            y1 = precison((m*x1) + c);
            list.push({x: x1, y: y1});
        }
    }

    list.pop();
    list.push({x: x2, y: y2})

    return list
}

const distanceBtw2Points = (x1, y1, x2, y2) => {
    return precison(Math.pow((Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2)), 1/2));
}

const findStepsFromPoint = (x1, y1, m, direction, distance, step) => {
    if(m < 0) {
        direction = !direction;
    }

    let temp = x1;
    x1 = y1;
    y1 = temp;

    const list = [{x: x1, y: y1}];
    let a, b, d;
    const c = y1 - (m*x1);

    do {
        a = Math.pow(m, 2) + 1;
        b = (2*m*c) - (2*m*y1) - (2*x1);
        d = -(Math.pow(step, 2) - Math.pow(y1, 2) - Math.pow(x1, 2) - Math.pow(c, 2) + (2*y1*c));

        if(direction) {
            x1 = precison(((-b) + Math.pow((Math.pow(b, 2) - (4*a*d)), 1/2))/(2*a));
            y1 = precison((m*x1) + c);
            list.push({x: x1, y: y1});
        } else {
            x1 = precison(((-b) - Math.pow((Math.pow(b, 2) - (4*a*d)), 1/2))/(2*a));
            y1 = precison((m*x1) + c);
            list.push({x: x1, y: y1});
        }

    } while(distanceBtw2Points(x1, y1, list[0].x, list[0].y) < distance);

    list.pop();

    return list
}

const doSomethingAsync = async () => {
    const list = findStepsBtwPoints(26.425792, 80.261381, 26.49593, 80.342987, 0.0025);
    // console.log(list.forEach((coord) => console.log(coord.y + ", " + coord.x)))

    let content = '';

    for(let i = 0; i < list.length; i++){
        let list1 = findStepsFromPoint(list[i].y, list[i].x, -(1/list[0].m), true, 0.09, 0.0025);
        // list1.forEach((coord) => {
        //     content = content + coord.y + ", " + coord.x + "\n";
        // })

        for(let i = 0; i < list1.length; i++){
            let response = await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
                    includedTypes: ["restaurant", "cafe", "bakery", "coffee_shop"],
                    maxResultCount: 20,
                    locationRestriction: {
                    circle: {
                        center: {
                        "latitude": list1[i].y,
                        "longitude": list1[i].x
                    },
                        "radius": 500.0
                    }
                    }
                }, {
                    headers: {
                    'X-Goog-FieldMask': '*',
                    'X-Goog-Api-Key': 'AIzaSyCTAL8teorsfqIdhElzUWkaJQ2Evn2T3qs',
                    'X-Goog-FieldMask': 'places.displayName,places.businessStatus,places.userRatingCount'
                    }
                }
            )

            appendPOJOtoJSON(response.data.places, filePath);
        }
    // }
}

// writeToTxtFile(filePathTxt, content);

// console.log(findStepsBtwPoints(26.435189, 80.291122, 26.438477, 80.282473, 0.005, true))
// console.log(findStepsFromPoint(26.435234, 80.291128, -5.849763550386366, true, 0.02, 0.005))

// const list = findStepsBtwPoints(26.435080, 80.291174, 26.448203, 80.295421, 0.0025, true)
// console.log(list)

// for(let i = 0; i < list.length; i++){
//     let list1 = findStepsFromPoint(list[i].x, list[i].y, -(1/list[0].m), true, 0.02, 0.0025);
//     console.log(list1)

//     for(let i = 0; i < list1.length; i++){
//         doSomethingAsync(list1[i].x, list1[i].y)
//     }
}

doSomethingAsync()

// console.log(findStepsFromPoint(26.452574, 80.309594, -1, true, 0.02, 0.005))

// console.log(distanceBtw2Points(26.452498, 80.309470, 26.476408, 80.309470))

// console.log(findStepsBtwPoints(26.452498, 80.309470, 26.466408, 80.309470, 0.005));

// google: long, lat

// console.log(findStepsFromPoint(26.432377, 80.416931, -0.859471, true, 0.10, 0.0025));

