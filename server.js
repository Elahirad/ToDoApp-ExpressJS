// Simple To-Do App
// Built with ExpressJS
// Ali Elahiraad
// Deployed On https://todo-app-expressjs.herokuapp.com/

// Import needs
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const sanitizeHTML = require('sanitize-html');
const dotenv = require('dotenv');
const todo_app = express();
let db;

// Setting port
let port = process.env.PORT;

// Using methods
todo_app.use(express.static('public'));
todo_app.use(express.json());
todo_app.use(express.urlencoded({ extended: false }));
todo_app.use(passwordProtection);

// Connecting to the database
MongoClient.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) throw new Error(err);
  console.log("Connected to database successfully !");
  db = client.db();
  todo_app.listen(port);
});
// UserName : aliel
// Password : Ali@123
function passwordProtection(req, res, next) {
  res.set("WWW-Authenticate", 'Basic realm="To-Do App"');
  if (req.headers.authorization == "Basic YWxpZWw6QWxpQDEyMw==") {
    next();
  } else {
    res.status(401).send("");
  }
}

//Main page
todo_app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>

        <div class="jumbotron p-3 shadow-sm">
          <form id="submit-form">
            <div class="d-flex align-items-center">
              <input id="userInput" name = "item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>

        <ul class="list-group pb-5" id="item-list">
        </ul>

      </div>
      <script>
        let items = ${JSON.stringify(items)};
      </script>
      <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`);
  });
});


// Creating item page
todo_app.post('/create-item', (req, res) => {
  db.collection("items").insertOne({ text: sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} }) }, (err, info) => {
    res.json(info.ops[0]);
  });
});

//Editing item page
todo_app.post('/edit-item', (req, res) => {
  db.collection('items').findOneAndUpdate({ _id: new ObjectID(req.body.id) }, { $set: { text: sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} }) } }, () => {
    res.send("Success !");
  })
});

//Deleting item page
todo_app.post("/delete-item", (req, res) => {
  db.collection("items").findOneAndDelete({ _id: new ObjectID(req.body.id) }, () => {
    res.send("Success !");
  })
})