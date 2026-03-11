const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function processData() {
  console.log("Starting data processing...");
 
  readFile("input.txt", "utf8")
    .then((data) => {
      console.log("File read successfully");
 
      const processedData = data.toUpperCase();
 
      fs.writeFile("output.txt", processedData, (err) => {
        if (err) {
          console.error("Write error:", err);
          return;
        }

        console.log("File written successfully");
 
        readFile("output.txt", "utf8")
          .then((verifyData) => {
            console.log("Verification successful");
            console.log("Data length:", verifyData.length);
          })
          .catch((err) => {
            console.error("Verification error:", err);
          });
      });
    })
    .catch((err) => {
      console.error("Read error:", err);
 
      fs.writeFile("input.txt", "Hello World!", (writeErr) => {
        if (writeErr) {
          console.error("Could not create input file:", writeErr);
        } else {
          console.log("Created input file, please run again");
        }
      });
    });
}

processData();
