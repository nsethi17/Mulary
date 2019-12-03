import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  items:  any = [];
  songs: any;
  test:any =[] ;

  constructor(private _http: HttpService) {}

  ngOnInit() {
    this._http.getSongs().subscribe(data =>{
      this.items = data
      this.items = Array.of(this.items)
      this.songs = this.items[0].result
      console.log(this.songs)
    
    });
  }
  //searchinf songs based on a keyword 
  search_songs() {
    let keyword =(document.getElementById("search_song") as HTMLInputElement).value;
    console.log(typeof keyword)
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
      console.log(keyword);
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
}

  