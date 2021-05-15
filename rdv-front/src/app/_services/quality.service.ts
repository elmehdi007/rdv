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
export class QualityService {

  constructor(private http: HttpClient) { }

  search(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {if(data[key]!=null)params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"quality/search/?"+params);
  }

  searching(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {if(data[key]!=null)params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"quality/searching/?"+params);
  }

  create(quality): Observable<any> {
       return this.http.post(environment.url_api + 'quality/create', quality, httpOptions);
   }

   update(quality): Observable<any> {
      return this.http.put(environment.url_api + 'quality/update/'+quality.id, quality, httpOptions);
  }

  delete(idquality): Observable<any> {
     return this.http.delete(environment.url_api + 'quality/delete/'+idquality, {});
  }
}
