//set up dependencies 
const fs = require('fs'); 
const path = require('path'); 
const express = require('express'); 
const { notes } = require('./db/db.json'); 
const database = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8')); 

const PORT = process.env.PORT || 3001;
const app = express(); 

// set up middleware function to handle data parsing
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) =>{
  res.sendFile(path.join(__dirname, './public/notes.html'));
});  


// //GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    return res.json(database)
}); 



// //POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post('/api/notes', (req, res) => {
    let dbLength = database.length - 1; 
    let id 
    if (dbLength < 0) {
        id = 1 
    } else {
        id = database[dbLength]["id"] + 1
    }
    database.push({id, ...req.body})
    res.json(database);
    console.log(database);
}); 

//delete the note 
app.delete('/api/notes/:id', (req, res) => {
    var toDelete = database.find(({id}) => id === JSON.parse(req.params.id)); 
    database.splice(database.indexOf(toDelete), 1); 
    console.log(database); 
    res.end(); 
}); 

// Listener
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});