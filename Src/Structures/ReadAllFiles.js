const fs = require('node:fs');
const path = require('node:path');

module.exports = function readFiles(dir, filesList = []) {
  try {
    if (!fs.existsSync(dir)) return filesList;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        readFiles(filePath, filesList); // Recursively read directories
      } else {
        filesList.push(filePath);
      }
    });

    return filesList;
  } catch (error) {
    console.error(`Error reading files from directory ${dir}:`, error);
    return filesList;
  }
};