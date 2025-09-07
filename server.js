
const express = require('express');
const bodyParser = require('body-parser');
const dictionary = require('./agents/dictionary');
const validator = require('./agents/validator');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('agents/librarian/web'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/agents/librarian/web/index.html');
});

app.post('/add-word', (req, res) => {
  const { word } = req.body;

  if (!validator.isValid(word)) {
    return res.status(400).json({ message: 'Invalid word. Please provide a non-empty word.' });
  }

  dictionary.addWord(word, 'User submitted word'); // Add a simple definition for now
  res.json({ message: `The word "${word}" has been successfully added to the dictionary.` });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
