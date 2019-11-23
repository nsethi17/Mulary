// Packages required
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var admin = require('firebase-admin');
var firebase = require('firebase');
//initializing express app
const app = express();
app.use(express.json({limit:'1mb'}));
//for cross origin reference
app.use(cors());

var firebaseConfig = {
    apiKey: "AIzaSyBoJR0QsS9gsBKxYkrqnr2CVC4amNLODdQ",
    authDomain: "webtech-project-11b73.firebaseapp.com",
    databaseURL: "https://webtech-project-11b73.firebaseio.com",
    projectId: "webtech-project-11b73",
    storageBucket: "webtech-project-11b73.appspot.com",
    messagingSenderId: "192768976142",
    appId: "1:192768976142:web:4c10372f999e051e5a635f",
    measurementId: "G-1H23D2NV51"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


// paths possible => /api/open , /api/secure , /api/admin
app.get("/api/open/user",(req,res) =>{
    console.log("get works with fb");
    let db = firebase.firestore();
    //let userRef = firebase.database().collection("/Users/");

    db.collection('Users').get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });

});

//process.env.PORT ||
const port =  1234;
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});