// Packages required
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const bcrypt = require('bcrypt');
var nodemailer = require ("nodemailer")
//initializing express app


const app = express();
app.use(express.json({limit:'1mb'}));
app.use(cors());



 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Web_proj";

//JWT 
const jwt = require('jsonwebtoken');

//SMTP Server setup
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nittinsant.sethi2015@vit.ac.in",
        pass: "njgames17"
    }
});

//User login 
app.post("/api/login",async (req,res)=>
{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");
        let query = req.body;
        console.log(query)
        db_obj.collection("temp_Users").findOne({email:{$eq:query.email}},async function(err,result)
        {
            if (err) res.send("user not found");
            try{
                if(await bcrypt.compare(query.password,result.password)){
                    res.send({'login':"success"});
                }
                else{
                    res.send({'login':"failed"});
                }
            }catch{
                res.send({'login':"Error"})
            }
            
            db.close();


        });

    });

});


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
app.post("/api/open/Songs/search",(req,res) =>//to search songs 
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
//creating a user  (followed a youtube tutorial-https://www.youtube.com/watch?v=Ud5xKCYQTjM)
app.put("/api/register",async(req,res)=>
{
    try{ 

        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(req.body.password,salt);
        console.log(salt)
        console.log(hashed_password)
        MongoClient.connect(url, function(err,db){
            if (err) throw err;
            let db_obj = db.db("Web_proj");
            let new_user = {email:req.body.email, password: hashed_password}
            db_obj.collection("temp_Users").insertOne(new_user,function(err, result){
                if (err) console.log(err);
                res.json({status: "Success"});
                db.close();
            });
            
            //email verification
            link="http://localhost:4200/api/open/songs/"+hashed_password;
            mailOptions={
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
             if(error){
                    console.log(error);
                res.end("error");
             }else{
                    console.log("Message sent: " + response.message);
                res.end("sent");
                 }
                });
                      
           
        });
    }
    catch{
        if(err) throw err;
    }
   
});

//process.env.PORT ||
const port =  1234;
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});