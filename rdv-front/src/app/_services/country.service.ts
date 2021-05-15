import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) { }

   search(data): Observable<any> {
     let params = "";
     Object.keys(data).forEach(function (key) {params+=key+"="+data[key]+"&";});
     params = params.slice(0, -1);
     return this.http.get(environment.url_api+"country/search/?"+params);
   }

   getCityByCountry(data): Observable<any> {
     let params = "";
     Object.keys(data).forEach(function (key) {params+=key+"="+data[key]+"&";});
     params = params.slice(0, -1);
     return this.http.get(environment.url_api+"country/city-by-country/?"+params);
   }
}
