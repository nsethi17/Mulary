import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { HttpService } from '../http.service';
import { NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { of } from 'rxjs';
import { __await } from 'tslib';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
import { Input } from '@angular/compiler/src/core';
import { getRandomString } from 'selenium-webdriver/safari';
import { Button } from 'protractor';
@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit, AfterViewChecked {
  ngAfterViewChecked(): void {

    var aob=document.getElementsByClassName("post_rev") 
    if(sessionStorage.getItem("login_flag")=="true"){
      // console.log(aob.item(0))
        for(let i=0;i<aob.length;i++){
          //aob.item(i).display= "block"
          aob[i].setAttribute("style","display:block;")
        }
      //console.log(aob.item(0))        
      };
     document.getElementById("ausers").style.display="block"
  }
  play: any= [];
  timer: any 
  items:  any = [];
  songs: any;
  lists : any;
  test:any =[] ;
  music: any = []
  constructor(private _http: HttpService, private _home:HomeComponent) {}
  
  ngOnInit() {
    
   this.getSongs() 
   this.getPlaylists()
  }
 
 
 // gettings songs using GET method
  getSongs() {

    this._http.getSongs().subscribe(data =>{
      this.items = data
      this.items = Array.of(this.items)
      this.songs = this.items[0].result 
      
    });
  }
  getPlaylists() {

    this._http.getPlaylists().subscribe(data =>{
      this.play = data
      this.play = Array.of(this.play)
      this.lists = this.play[0].result 
      console.log(data)
    });
  }
 
 
   // getting all reviews for a song when it is expanded 
   expand_item(song,ar,al,y,g){
    document.getElementById("overlay").style.width = "100%";
    document.getElementById("t").innerHTML = song;
    document.getElementById("ar").innerHTML = ar;
    document.getElementById("al").innerHTML = al;
    document.getElementById("y").innerHTML = y;
    document.getElementById("g").innerHTML = g;
    this._http.getReviews(song).subscribe(data =>{
      this.music =data;
      let num_revs = data.result.length
       let sum = 0 
      let r = data.result.slice(-1).pop()
      let p = document.createElement("li")
      let x = document.createElement("p")
      let y = document.createElement("p")
      let z = document.createElement("p")
      x.innerHTML = "User: " + r.user
      y.innerHTML = "review: " + r.review
      z.innerHTML = "rating: " +r.rating
      p.appendChild(x)
      p.appendChild(y)
      p.appendChild(z) 
      p.style.cssText="background: rgb(65, 62, 62); color: hotpink; padding: 1em; margin-right: 10px; width: 100%; height: fit-content; margin-bottom: 1em; display: list-item; flex-direction: column;"

      let list = document.getElementById("review_list")
      list.appendChild(p)
      for(let i = 0;i<data.result.length;i++){
         sum += parseFloat(data.result[i].rating) 
      }
      for(let i =0 ; i<num_revs-1;i++){

        let p = document.createElement("li")
        p.setAttribute("id", "r"+i)
        p.style.cssText="background: rgb(65, 62, 62); color: hotpink; padding: 1em; margin-right: 10px; width: 100%; height: fit-content; margin-bottom: 1em; display: list-item; flex-direction: column;"
        p.style.display="none"
        let x = document.createElement("p")
        let y = document.createElement("p")
        let z = document.createElement("p")
        x.innerHTML = "User: " + this.music.result[i].user
        y.innerHTML = "review: " + this.music.result[i].review
        z.innerHTML = "rating: " + this.music.result[i].rating
        let list = document.getElementById("review_list")
        p.appendChild(x)
        p.appendChild(y)
        p.appendChild(z)
        list.appendChild(p)
       }
      let avg_rat = 0
      avg_rat = sum/num_revs
      document.getElementById("avg rating").innerHTML=avg_rat+("/5")      
    })
  }
// to close the expanded section
  close(){
    //this._home.display()
    location.reload()
    document.getElementById("overlay").style.width = "0%";

  }

  playlist_view(t,des,vis,s){

    document.getElementById("overlay2").style.width = "100%";
    document.getElementById("pname").innerHTML = t;
    document.getElementById("pdes").innerHTML = des;
    document.getElementById("pvis").innerHTML = vis;
    for(let i=0;i<s.length;i++){
      let l = document.createElement("li")
      let x = document.createElement("p")
      let y = document.createElement("p")
      let z = document.createElement("p")
      l.setAttribute("id","index"+i)
      l.style.cssText="background: rgb(65, 62, 62); color: hotpink; padding: 1em; margin-right: 10px; width: 100%; height: fit-content; margin-bottom: 1em; display: list-item; flex-direction: column;"

      x.innerHTML=s[i].title
      y.innerHTML=s[i].artist
      z.innerHTML=s[i].album
      l.appendChild(x)
      l.appendChild(y)
      l.appendChild(z)
      document.getElementById("play_list").appendChild(l)
    }
  }
  
  
  
  //searching songs based on a keyword  using POST method
  search_songs() 
  { 
    let keyword =(document.getElementById("search_song") as HTMLInputElement).value;
    let ip = [keyword]
    if(keyword!= "") {
      if (sanitized_input(ip)){ // sanitization
       let tag = document.getElementById("search_tag");
        tag.innerHTML= "Showing Results for: "+ keyword;
        tag.style.display = "inline";
        this._http.searchResult(keyword).subscribe(test =>{
          this.items = test
          this.items = Array.of(this.items)
          this.songs  =this.items[0].result
          console.log(this.songs)
        }

        );
      }
      else{
        window.alert("Invalid Input")
      }
  }
    else{
      document.getElementById("search_tag").style.display="none";
      this._http.getSongs().subscribe(data =>{
        this.items = data
        this.items = Array.of(this.items)
        this.songs = this.items[0].result
        console.log(this.songs)
      
      });
    }

  }
  //showing all reviews for a song
  dispRevs()
  { 
    console.log("revss")
    for(let i = 0; i<this.music.result.length -1;i++){
      document.getElementById("show_rev").style.display="none";
      document.getElementById("r"+i).style.display="block"
    }
   

  }
  addReview(song){ // add option to post review using POST method
    let rev = window.prompt("What are your views?")
    let rate = window.prompt("Rate the song ot of 5:")
    let ip  = [rev,rate]
    if(rev !=null){
    if(sanitized_input(ip)){ // sanitizing i/p
    this._http.postReview(rev,rate,song).subscribe(data =>{
      if(data.result="success"){
        window.alert("review posted")
      }
    })
  }
    else{
      window.alert("Invalid input");
    }
  }
}

// adding songs using POST method
  addSong()
  { 
    let title = window.prompt("Title of the song")
    let artist = window.prompt("Name of the artist")
    if (title =="" || title == null ||artist == "" || artist =="null"){
      window.alert("Title and artist are mandatory fields")
    }
    else{
      let album = window.prompt("Name of the album")
      let year = window.prompt("Name of the year")
      let genre = window.prompt("Name of the genre")
      let ip = [title,artist,album,year,genre]
      if(sanitized_input(ip)){// sanitizing i/p

        this._http.addsong(title,artist,album,year,genre).subscribe(data =>{
          if(data.result="success"){
            window.alert("1 song added")
            let rev = window.confirm("Want to add a review?")
            if(rev){
              this.addReview(title); //adding review while adding songs 
            }
            setInterval(()=>{this.getSongs()},1000)
          }
        })
    }
      else{
        window.alert("Invalid input")

    }
    }
  };

  //create a new playlist
newPlaylist(){

  let name = window.prompt("Name of the playlist?")
  let des = window.prompt("Description:")
  let vis = "private";  
  let visibility = window.confirm("Do you want to make this playlist Public?")
  if(visibility == true){
    vis= "public";
  }
  else{
    vis = vis;
  }
  if(des !="" || des!= null){
  var ip = [name,des]
  ip = Array.from(ip)
  }
  else{
    ip = [name]
    ip = Array.from(ip)
  }
  if(sanitized_input(ip)){ // sanitizing ip
    this._http.addPlaylist(name,des,vis).subscribe(data =>{
      if(data.result="success"){
        window.alert("New Playlist created")
      }
      setInterval(()=>{this.getPlaylists()},1000)

    });
    
  }
  else{
    window.alert("Invalid input")
  }
};

//adding song to playlist
adds2p(song,ar,al,y,g){
  let name = window.prompt("Which playlist do you want to add to?")
  let ip = [name]
  let lib = [{"title":song,"artist":ar,"album":al,"year":y,"genre":g}]
  if(sanitized_input(ip)){//sanitizing input
  
  
  this._http.inserttoPlaylist(name,lib).subscribe(data =>{
    console.log(data.result)

    if(data.result=="success"){
      window.alert("1 song inserted")
    }
    else{
      window.alert("you cannot update anyone else's playlist")
    }
    setTimeout(()=>{this.getPlaylists()},1000)


  });
  }
  else{
    window.alert("Invalid input")
  }
};
  
}



//for sanitizing user input
function sanitized_input(ip){
  console.log(ip.length)
   let regex = /^([\w\d\s\.\!\"\']|)+$/
   let count = 0
   for( let i=0;i<ip.length;i++){
    console.log(Boolean(ip[i].match(regex)))
     if(Boolean(ip[i].match(regex))){
        
        count +=1;
      }
}
if(count == ip.length){
  return true ;
  }
  else 
  {
    console.log(count)
    return false;
  }
}

  


  