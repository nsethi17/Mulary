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
        
        db_obj.collection("temp_Users").findOne({email:{$eq:query.email},account:"activate"}, async function(err,result)
        {
            if (err) res.send("user not found");
            
            try{
                if( await bcrypt.compare(query.password,result.password)){
                    let tok = jwtCreate(query.email);
                    if(result.status=="inactive"){
                        email_send(result.email,result.password)
                    }
                    res.send({'login':'success','status':result.status,'token':tok,'admin':result.admin});
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
            let new_user = {email:req.body.email, password: hashed_password ,status:"inactive", admin:"false",account:"activate"}
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
                
                    email_send(new_user.email,hashed_password)
                }
            })                      
           
        }); 
    }
    catch{
        if(err) throw err;
    }
   
});
function email_send(em,hpw){
      //email verification
      link="http://localhost:1234/api/verify?hash="+hpw;
      mailOptions={
          to : em,
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
app.get("/api/verify",(req,res)=>{

    MongoClient.connect(url, function(err, db){
        if (err) console.log(err);
        let db_obj =db.db("Web_proj");
        console.log(req.query.hash)
    
        db_obj.collection("temp_Users").updateOne({password:{$eq:req.query.hash}},{$set:{status:"active"}},function(err,result){
            if(err) throw err;
            
            res.send("email has been verified. Go to the link below to login: http://localhost:4200/ ")
            // res.writeHead(301,
            //     {Location: 'http://localhost:4200/'}
            //   );
            //   res.end();
              
        });

    });
});


// paths possible => /api/open , /api/secure , /api/admin
// UNAUTH USER REQS (/API/OPEN)
app.get("/api/open/Songs",(req,res) =>
{ //followed w3schools tutorial for making requests
    
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");

    db_obj.collection("Songs").find({hidden:"false"},{projection:{_id:0}}).sort({num_revs:-1}).toArray(function(err,result){
        if (err) console.log( err);
        res.send({'result':result});
        db.close();
    });
  
});
});
//getting playlists for unauthenticated users
app.get("/api/open/Playlists",(req,res) =>
{ 
    
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");
    let query="public"
    db_obj.collection("Playlists").find({visibility:{$eq:query}},{projection:{_id:0}}).toArray(function(err,result){
        if (err) console.log( err);
        res.send({'result':result});
        db.close();
    });
  
});
});



//getting song reviews 
app.post("/api/open/review",(req,res)=>{
    MongoClient.connect(url, function(err, db){
        if (err) console.log(err);
        let db_obj =db.db("Web_proj");
        let query = req.body.title
        console.log(query)
        db_obj.collection("Reviews").find({title: {$eq:query}},{projection:{_id:0}}).toArray(function(err,result){
            if (err) console.log( err);     
            res.send({'result':result});
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
//AUTHENTICATED USER REQUESTS (/API/USER)
//getting playlists for authenticated users
app.get("/api/secure/Playlists",jwtAuth,(req,res) =>
{ 
    console.log(req.username)
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let dat = {}
    let db_obj =db.db("Web_proj");
    let query="public"
    db_obj.collection("Playlists").find({$or:[{visibility:{$eq:query}},{user:{$eq:req.username}}]},{projection:{_id:0}}).toArray(function(err,result){
        if (err) console.log( err);
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
        let new_review = {title: req.body.song, user:req.username,rating:req.body.rating,review:req.body.review}
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
app.post("/api/secure/add_song",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {   let tags = [req.body.title,req.body.artist,req.body.album,req.body.year,req.body.genre]
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        let new_song = req.body//{title: req.body.song, user:req.username,rating:"5",review:req.body.review}
        new_song.Tags =tags;
        new_song.num_revs=0;
        new_song.hidden="false"
        db_obj.collection("Songs").insertOne(new_song,function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});
            db.close();
        });

      

    });
})

// creating a new playlist
app.put("/api/secure/new_playlist",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {   
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        let new_play = req.body 
        new_play.user = req.username
        db_obj.collection("Playlists").insertOne(new_play,function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});
            db.close();
        });

      

    });
})
// adding songs to a playlist
app.post("/api/secure/insertpl",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        db_obj.collection("Playlists").updateOne({name: {$eq:req.body.name},user:{$eq:req.username}},{$push:{songs: {$each: req.body.songs}}},function(err, result){
            if (err) console.log(err);
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
            db.close();
        });
        

      

    });
})
//editing a playlist
app.post("/api/secure/editpl",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");
        db_obj.collection("Playlists").updateOne({name: {$eq:req.body.name},user:{$eq:req.username}},{$set:{[req.body.field]: req.body.newval}},function(err, result){
            if (err) console.log(err);
            console.log(result.modifiedCount)
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
            db.close();
        });
        
    });
})

// removing songs from a playlist
app.post("/api/secure/removesongfrompl",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        db_obj.collection("Playlists").updateOne({name: {$eq:req.body.name},user:{$eq:req.username}},{$pull:{songs:{title:req.body.song}}},function(err, result){
            if (err) console.log(err);
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
            db.close();
        });
        

      

    });
})
//ADMIN REQUESTS(/API/ADMIN)
//getting playlists for admin users
app.get("/api/admin/Playlists",jwtAuth,(req,res) =>
{ 
    console.log(req.username)
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");
    db_obj.collection("Playlists").find({},{projection:{_id:0}}).toArray(function(err,result){
        if (err) console.log( err);
        res.send({'result':result});
        db.close();
        
    });
     
}); 
});

//getting all songs
app.get("/api/admin/Songs",(req,res) =>
{ //followed w3schools tutorial for making requests
    
  MongoClient.connect(url, function(err, db){
    if (err) console.log(err);
    let db_obj =db.db("Web_proj");

    db_obj.collection("Songs").find({},{projection:{_id:0}}).sort({num_revs:-1}).toArray(function(err,result){
        if (err) console.log( err);
        res.send({'result':result});
        db.close();
    });
  
});
});

//modifying songs 
app.post("/api/admin/modifySong",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        console.log(req.body.name,req.body.field,req.body.newval)
        let db_obj =db.db("Web_proj");
        db_obj.collection("Songs").updateOne({title: {$eq:req.body.name}},{$set:{[req.body.field]: req.body.newval}},function(err, result){
            if (err) console.log(err);
            console.log(result.modifiedCount)
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
            db.close();
        });
        
    });
})

//deleting a song
app.post("/api/admin/deleteSong",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        db_obj.collection("Songs").deleteOne({title:req.body.name},function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});     
            db.close();
        });
        

      

    });
})

//deleting a playlist
app.post("/api/admin/deletePlaylist",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");  
        db_obj.collection("Playlists").deleteOne({name:req.body.name},function(err, result){
            if (err) console.log(err);
            res.send({"result": "success"});     
            db.close();
        });
        

      

    });
})

//granting admin rights 
app.post("/api/admin/newAdmin",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");
        db_obj.collection("temp_Users").updateOne({email: {$eq:req.body.email}},{$set:{admin: "true"}},function(err, result){
            if (err) console.log(err);
            console.log(result.modifiedCount)
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
            db.close();
        });
        
    });
})

//activating/deactivating user 
app.post("/api/admin/userActDeact",jwtAuth,(req,res)=>{
    MongoClient.connect(url, function(err,db)
    {
        if(err) console.log(err);
        let db_obj =db.db("Web_proj");
        db_obj.collection("temp_Users").updateOne({email: {$eq:req.body.email}},{$set:{account: req.body.account}},function(err, result){
            if (err) console.log(err);
            console.log(result.modifiedCount)
            if(result.modifiedCount>0){
            res.send({"result": "success"});
        }
        else{
            res.send({"result": "failed"});
        }
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
const port =  process.env.PORT;//dynamic value
app.listen(port, () => {
    console.log('Server is up and running on port no.:'+ port);
});
