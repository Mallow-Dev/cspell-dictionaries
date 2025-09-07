
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Librarian CLI starting...");

const scan = () => {
  console.log("Librarian is scanning the repository for spelling errors...");

  let classificationHints = { hints: {} };
  const hintsPath = path.join(__dirname, '../../memory-bank/project.default.json');
  try {
    const hintsData = fs.readFileSync(hintsPath, 'utf8');
    classificationHints = JSON.parse(hintsData);
  } catch (error) {
    console.warn(`Could not load classification hints from ${hintsPath}: ${error.message}`);
  }

  let rawIssues = [];
  try {
    // The command will be 'npx cspell --no-summary --no-color --reporter=json lint .'
    const cspellOutput = execSync('npx cspell lint --no-summary --no-color --reporter json .', { encoding: 'utf8', stdio: 'pipe' });
    const cspellResult = JSON.parse(cspellOutput);
     rawIssues = cspellResult.issues.map(issue => ({
      word: issue.text,
      context: `${issue.uri}:${issue.row}:${issue.col}`
    }));
  } catch (error) {
    // cspell exits with a non-zero status code if it finds issues.
    // The JSON output is sent to stdout even on failure.
    if (error.stdout) {
      const cspellResult = JSON.parse(error.stdout);
      rawIssues = cspellResult.issues.map(issue => ({
        word: issue.text,
        context: `${issue.uri}:${issue.row}:${issue.col}`
      }));
    } else {
      // If there are no spelling issues, cspell exits with 0 and doesn't produce JSON output to stdout unless there are issues.
      // If there's no stdout and an error, it's a real error.
      // But if there's no error and no stdout, it means no issues were found.
      if (!error.stderr) {
        console.log("No spelling issues found.");
        return; // Exit gracefully
      }
      console.error(`Error running cspell: ${error.stderr}`);
      process.exit(1);
    }
  }


  const classifiedIssues = rawIssues.map(issue => {
    let classification = 'unclassified'; // Default classification
    for (const category in classificationHints.hints) {
      if (classificationHints.hints[category].includes(issue.word)) {
        classification = category;
        break;
      }
    }
    return { ...issue, classification, accepted: false };
  });

  const outputDir = path.join(__dirname, '../../.mallow/memory');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const requestFileName = path.join(outputDir, 'librarian-requests.json');
  fs.writeFileSync(requestFileName, JSON.stringify(classifiedIssues, null, 2), 'utf8');
  console.log(`Classified cSpell issues staged in ${requestFileName}`);
};

// A very basic CLI argument parser
const args = process.argv.slice(2);

if (args.includes('scan')) {
  scan();
} else {
  console.log("Usage: mallow-librarian scan");
}
