const fs = require('fs');

let existingData = [];
const filePath = './data.json';


try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    existingData = JSON.parse(fileContent);
} catch (error) {
    // Handle file not found or invalid JSON
    console.error(`Error reading or parsing file ${filePath}: ${error.message}`);
    return;
}

// console.log(existingData.length);


// -------------------------------------------------

// const result = existingData.filter((obj) => obj.businessStatus === "OPERATIONAL");

// const updatedJsonString = JSON.stringify(result, null, 2);

// fs.writeFileSync(filePath, updatedJsonString, 'utf-8');

// -------------------------------------------------

// const result = existingData.filter((obj) => obj.userRatingCount);

// const updatedJsonString = JSON.stringify(result, null, 2);

// fs.writeFileSync(filePath, updatedJsonString, 'utf-8');

// -------------------------------------------------

// let list = []

// list.push(existingData[0]);

// for(let i = 1; i < existingData.length; i++){
//     if(existingData[i-1].displayName.text !== existingData[i].displayName.text){
//         list.push(existingData[i]);
//     }
// }

// const updatedJsonString = JSON.stringify(list, null, 2);

// fs.writeFileSync(filePath, updatedJsonString, 'utf-8');

// --------------------

// console.log(existingData.length)

// let count = 0;

// for(let i = 0; i < existingData.length; i++) {
//     if(existingData[i].userRatingCount > 100){
//         count++;
//     }
// }

// console.log(count)

// -------------------------------------------------

// const content = existingData.filter((data) => data);

// const updatedJsonString = JSON.stringify(content, null, 2);

// fs.writeFileSync(filePath, updatedJsonString, 'utf-8');

// -------------------------------------------------



// ---------------------------------------------------
let count = 0;

for(let i = 0; i < existingData.length; i++) {
    if(existingData[i].userRatingCount >= 700) {
        count++;
    }
}

console.log(count)

// ---------------------------------------------------

// console.log(existingData.length);