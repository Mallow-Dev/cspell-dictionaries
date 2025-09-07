#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log("Curator CLI starting...");

const curate = () => {
  console.log("Curator is curating requests...");

  const memoryDir = path.join(__dirname, '../../.mallow/memory');
  const requestFilePath = path.join(memoryDir, 'librarian-requests.json');
  console.log(`Attempting to load librarian requests from: ${requestFilePath}`);

  if (!fs.existsSync(requestFilePath)) {
    console.error("Librarian requests file not found. Please run the Librarian first.");
    process.exit(1);
  }

  let requests;
  try {
    const requestFileData = fs.readFileSync(requestFilePath, 'utf8');
    requests = JSON.parse(requestFileData);
    console.log("Successfully loaded librarian requests.");
  } catch (error) {
    console.error(`Error reading or parsing librarian requests file: ${error.message}`);
    process.exit(1);
  }

  console.log("Loaded requests:", requests);

  // Group requests by classification
  const curated = requests.reduce((acc, request) => {
    const { classification } = request;
    if (!acc[classification]) {
      acc[classification] = [];
    }
    acc[classification].push(request);
    return acc;
  }, {});

  console.log("Curated requests:", curated);

  // Write out curated requests to separate files
  for (const classification in curated) {
    const outputPath = path.join(memoryDir, `curator-${classification}-requests.json`);
    console.log(`Writing ${classification} requests to: ${outputPath}`);
    try {
      fs.writeFileSync(outputPath, JSON.stringify(curated[classification], null, 2), 'utf8');
      console.log(`Successfully wrote ${classification} requests to file.`);
    } catch (error) {
      console.error(`Error writing ${classification} requests to file: ${error.message}`);
    }
  }

  console.log("Curator finished curating requests.");
};

const args = process.argv.slice(2);

if (args.includes('curate')) {
  curate();
} else {
  console.log("Usage: node agents/curator/cli.js curate");
}
