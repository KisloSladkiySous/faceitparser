import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, interval, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceitService {

  constructor(private http:HttpClient) { }
  

  parseFaceitMatchData(userLogin:string):Observable<any> {
    return interval(15000).pipe(
      switchMap(() =>  { 
        console.log('inside');
        const token = 'd80e4a91-d091-4d25-816d-30c934cfe8fc'
        var header = {
          headers: new HttpHeaders()
            .set('Authorization',  `Bearer ${token}`)
            .set('Access-Control-Allow-Origin','*')
            .set('Access-Control-Allow-Methods','GET, POST, PUT, DELETE')
            .set('Access-Control-Allow-Headers','Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type')
        }
        
        return this.http.get(`https://open.faceit.com/data/v4/players?nickname=${userLogin}`,header).pipe(
          tap((res) => console.log(res))
        )
      })
    )
  }
}
