import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  items:  any = [];
  songs: any;
  test:any = {} ;

  constructor(private _http: HttpService) { }

  ngOnInit() {
    this._http.getSongs().subscribe(data =>{
      this.items = data
      this.items = Array.of(this.items)
      this.songs = this.items[0].result
      console.log(this.songs)
    });
  }

}
  