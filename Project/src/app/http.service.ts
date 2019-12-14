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
  postReview(rev:any,song:any){
    let review = {"review":rev,"song":song}
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

}
