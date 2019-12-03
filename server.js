// Packages required
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request')
var cors = require('cors')
//initializing express app

const app = express();
app.use(express.json({limit:'1mb'}));
app.use(cors());


// app.use((req,res,next) =>
// {
//     express.json({limit:'1mb'});
//     res.header('Access-Control-Allow-Origin','*');
//     next();
// });


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Web_proj";

//JWT 
const jwt = require('jsonwebtoken');



// paths possible => /api/open , /api/secure , /api/admin
app.get("/api/open/Songs",(req,res) =>
{ //followed w3schools tutorial for making requests
    // request({url:'http://localhost:1234/api/open/Songs'})
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");
    console.log(process.env.webproj_jwtkey)

    db_obj.collection("Songs").find({},{projection:{_id:0}}).toArray(function(err,result){
        if (err) console.log( err);
       // const token = jwt.sign(result,process.env.webproj_jwtkey);
        //console.log(token);
        res.send({'result':result});
        console.log(result);
        db.close();
    });
  
});
    
});
//followed w3schools tutorial for making requests
app.post("/api/open/Songs",(req,res) =>
{    //request({url:'http://localhost:1234/api/open/Songs'})
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");
        let query = req.body.Tags;
        console.log(query)
        db_obj.collection("Songs").find({$text: {$search:query}},{projection:{_id:0}}).toArray(function(err,result)
        {
            if (err) console.log(err);
            res.send({'result':result});
            db.close();


        });

    });
    
});

//process.env.PORT ||
const port =  1234;
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});