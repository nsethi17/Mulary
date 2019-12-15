import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }
  // to get songs
  getSongs(){
    return this.http.get('http://localhost:1234/api/open/Songs');
  }

   // to get songs
   getPlaylists(){
     if(sessionStorage.getItem("login_flag")=="true"){
      return this.http.get('http://localhost:1234/api/secure/Playlists',{
        headers: new HttpHeaders( {
          'Content-Type': 'application/json',
          'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
        }),
        observe:"body"

      });
  }
  else {
    return this.http.get('http://localhost:1234/api/open/Playlists')
  }
  }

  // to search songs based on a keyword
  searchResult(keyword: any):Observable<any>{
    let kw: any = {};
    kw.Tags=keyword;
    
    return this.http.post<any>('http://localhost:1234/api/open/Songs/search',kw,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe:"body"
    })
  }

  //get reviews
  getReviews(song: any):Observable<any>{
     let s: any = {};
     s.title=song;
    console.log(song)
    return this.http.post<any>('http://localhost:1234/api/open/review',s,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe:"body",
    })
  }

  //to check if User exists or not
  user_login(u:any):Observable<any>{
    let user = u;
    return this.http.post<any>('http://localhost:1234/api/login',user,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe:"body"
    })

  }

  // for adding new user
  user_signup(u:any):Observable<any>{
    let user = u;
    return this.http.put<any>('http://localhost:1234/api/register',user,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe:"body"
    })

  }

//adding reviews
  postReview(rev:any,rate:any,song:any){
    let review = {"review":rev,"rating":rate,"song":song}
    return this.http.post<any>('http://localhost:1234/api/secure/review',review,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
      }),
      observe:"body"
    })

  }

// for adding songs
  addsong(t,a,al,y,g){
    let new_song = {"title":t,"artist":a,"album":al,"year":y,"genre":g}
    return this.http.post<any>('http://localhost:1234/api/secure/add_song',new_song,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
      }),
      observe:"body"
    })

  }
// adding new playlist
  addPlaylist(n,d,v){
    if(d ==""){
      d= "No Description";
    }
    let new_playlist = {"name": n, "description":d,"visibility":v}
    console.log(new_playlist)
    return this.http.put<any>('http://localhost:1234/api/secure/new_playlist',new_playlist,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
      }),
      observe:"body"
    })
    
  }

  //adding songs to a playlist
  inserttoPlaylist(name,lib):Observable<any>{
    let sp = {"name":name,"songs":lib};
    return this.http.post<any>('http://localhost:1234/api/secure/insertpl',sp,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
      }),
      observe:"body"
    })

  }

  //editing a playlist
  editpl(title,field,new_value):Observable<any>{
    
    let sp = {"name":title,"field":field,"newval":new_value};
    
    
    return this.http.post<any>('http://localhost:1234/api/secure/editpl',sp,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization':'Bearer:'+sessionStorage.getItem("access-token")
      }),
      observe:"body"
    })

  }

}
