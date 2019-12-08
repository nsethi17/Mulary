import { Component, OnInit, AfterViewInit, AfterContentInit, AfterViewChecked } from '@angular/core';
import { HttpService } from '../http.service';
import { NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { of } from 'rxjs';
import { __await } from 'tslib';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';
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
      
  }
 

  items:  any = [];
  songs: any;
  test:any =[] ;
  
  constructor(private _http: HttpService, private _home:HomeComponent) {}
  
  ngOnInit() {
    
   this.getSongs() 
  }
 
 
  getSongs() {

    this._http.getSongs().subscribe(data =>{
      this.items = data
      this.items = Array.of(this.items)
      this.songs = this.items[0].result 
      
    });


   
   
  }
 
  
  
  //searching songs based on a keyword 
  search_songs() 
  { 
    let keyword =(document.getElementById("search_song") as HTMLInputElement).value;
    if(keyword!= "") // 
    { let tag = document.getElementById("search_tag");
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
      document.getElementById("search_tag").style.display="none";
      this._http.getSongs().subscribe(data =>{
        this.items = data
        this.items = Array.of(this.items)
        this.songs = this.items[0].result
        console.log(this.songs)
      
      });
    }

  }
  getReviews()
  {
    console.log("hi")

  }
  addReview(song){
    let rev = window.prompt("What are your views?")
    let sname = song;
    this._http.postReview(rev,song).subscribe(data =>{
      console.log("rev posted")
    })
  }
  
}




  


  