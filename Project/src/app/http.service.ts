import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getSongs(){
    return this.http.get('http://localhost:1234/api/open/Songs');
  }
  searchResult(keyword: any):Observable<any>{
    let kw: any = {};
    kw.title=keyword;
    return this.http.post<any>('http://localhost:1234/api/open/Songs',kw,{
      headers: new HttpHeaders( {
        'Content-Type': 'application/json'
      }),
      observe:"body"
    })
  }
}
