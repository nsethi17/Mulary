// Packages required
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

//initializing express app
const app = express();
app.use(express.json({limit:'1mb'}));
//for cross origin reference
app.use(cors());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Web_proj";


// paths possible => /api/open , /api/secure , /api/admin
app.get("/api/open/Users",(req,res) =>{
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");
    db_obj.collection("Users").find({},{projection:{_id:0}}).toArray(function(err,result){
        if (err) console.log( err);
        res.send({'result':result});
        console.log(result);
        db.close();
    });
});

});

//process.env.PORT ||
const port =  1234;
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});