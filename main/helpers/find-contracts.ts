const { app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

// Function to check if the file is a Soroban contract
function isSorobanContract(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content.includes("#![no_std]") && content.includes("soroban_sdk::{");
}

// Function to recursively find Soroban contract files
export function findContracts(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = findContracts(fullPath, arrayOfFiles);
    } else {
      // Look specifically for lib.rs files that are Soroban contracts
      if (file === "lib.rs" && isSorobanContract(fullPath)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}
