// Packages required
require('dotenv').config()
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
        
        db_obj.collection("temp_Users").findOne({email:{$eq:query.email}}, async function(err,result)
        {
            if (err) res.send("user not found");
            
            try{
                if( await bcrypt.compare(query.password,result.password)){
                    let tok = jwtCreate(query.email);
                    res.send({'login':'success','status':result.status,'token':tok});
                }
                else{
                    res.send({'login':"failed"});
                }
            }
            catch{
                res.send({'login':"Error"})
            }
            
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
            db_obj.collection("temp_Users").findOne({email:{$eq:new_user.email}},function(err,result){
                if(result!=null && new_user.email == result.email)
            {   
                res.send({"result":"user exists"})
            }
                else
                {
                    console.log(new_user.email)
                    db_obj.collection("temp_Users").insertOne(new_user,function(err, result2){
                    if (err) console.log(err);
                    res.send({"result": "success"});
                    db.close();
                });
                
                //email verification
                link="http://localhost:1234/api/verify?hash="+hashed_password;
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
                        res.Send("sent");
                    }
                    });
                }
            })                      
           
        }); 
    }
    catch{
        if(err) throw err;
    }
   
});

app.get("/api/verify",(req,res)=>{

    MongoClient.connect(url, function(err, db){
        if (err) console.log(err);
        let db_obj =db.db("Web_proj");
        console.log(req.query.hash)
    
        db_obj.collection("temp_Users").updateOne({password:{$eq:req.query.hash}},{$set:{status:"active"}},function(err,result){
            if(err) throw err;
            res.writeHead(301,
                {Location: 'http://localhost:4200/'}
              );
              res.end();
        });

    });
});


// paths possible => /api/open , /api/secure , /api/admin
app.get("/api/open/Songs",(req,res) =>
{ //followed w3schools tutorial for making requests
    
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");

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
{    
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


//posting review
app.post("/api/secure/review",jwtAuth,(req,res)=>{
    console.log(req.username, req.body.review)
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        let new_review = {title: req.body.song, user:req.username,rating:"5",review:req.body.review}
        console.log(new_review)
        db_obj.collection("Songs").update({title: {$eq:new_review.title}},{$inc:{num_revs:1}});
        db_obj.collection("Reviews").insertOne(new_review,function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});
            db.close();
        });

      

    });
})

//adding new songs
//posting review
app.post("/api/secure/add_song",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {   let tags = [req.body.title,req.body.artist,req.body.album,req.body.year,req.body.genre]
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        let new_song = req.body//{title: req.body.song, user:req.username,rating:"5",review:req.body.review}
        new_song.Tags =tags;
        db_obj.collection("Songs").insertOne(new_song,function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});
            db.close();
        });

      

    });
})


function jwtCreate(user){
    let token = jwt.sign(user,process.env.jwt_key);
    return token;

}
// followed youtube tutorial- https://www.youtube.com/watch?v=mbsmsi7l3r4 for jwt
// verifying token 
function jwtAuth(req,res,next){
    const header = req.headers['authorization'];
    let token = header && header.split(":")[1];
    if (token ==null) res.sendStatus(401);
    jwt.verify(token,process.env.jwt_key,(err,username)=>{
        if(err) res.sendStatus(403);
        req.username = username;
        next(); 
    })

}
//process.env.PORT ||
const port =  1234;
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});
