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

existingData.sort((obj1, obj2) => obj1.displayName.text.localeCompare(obj2.displayName.text))

const updatedJsonString = JSON.stringify(existingData, null, 2);

fs.writeFileSync(filePath, updatedJsonString, 'utf-8');
