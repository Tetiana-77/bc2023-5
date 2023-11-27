const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require("body-parser");

const app = express();
const port = 8000;

app.use(multer().none());
app.use(express.json());
app.use(express.static('static'));
app.use(bodyParser.raw({ type: 'text/plain' }));

let filename = 'notes.json';

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, '[]', 'utf8');
}

const notes = JSON.parse(fs.readFileSync(filename, 'utf8'));

function writefile() {
  fs.writeFileSync(filename, JSON.stringify(notes), 'utf8');
}

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.get('/UploadForm.html', (req, res) => {
  res.sendFile(__dirname + '/static/UploadForm.html');
});

app.post('/upload', (req, res) => {
  const note_name = req.body.note_name;
  const note = req.body.note;
  const existing = notes.find(note => note.note_name === note_name);

  if (existing) {
    res.status(400).send("This note already exist");
  } else {
    notes.push({ note_name: note_name, note: note });

  writefile();


    res.status(201).send("Created");
  } 
}); 


app.get('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name;
  const findnote = notes.find(note => note.note_name === note_name);

  if (findnote) {
    res.send(findnote.note);
  } else {
    res.status(404).send('Not Found');
  }
});

app.put("/notes/:noteName", (req, res) => {
  const noteName = req.params.noteName;
  const noteIndex = notes.findIndex(note => note.note_name === noteName);

  if (noteIndex !== -1) {
    notes[noteIndex].note = req.body;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});


app.delete('/notes/:note_name', (req, res) => {
  const note_name = req.params.note_name;
  const noteIndex = notes.findIndex(note => note.note_name === note_name);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    writefile()
    res.status(200).send('Note deleted');
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log(`The server is running on the port ${port}`);
});
