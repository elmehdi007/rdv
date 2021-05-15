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
export class AlertService {

  constructor(private http: HttpClient) { }

  search(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {if(data[key]!=null)params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"alert/search/?"+params);
  }

  searching(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {if(data[key]!=null)params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"alert/searching/?"+params);
  }

  create(alert): Observable<any> {
       return this.http.post(environment.url_api + 'alert/create', alert, httpOptions);
   }

   update(alert): Observable<any> {
      return this.http.put(environment.url_api + 'alert/update/'+alert.id, alert, httpOptions);
  }

  delete(idalert): Observable<any> {
     return this.http.delete(environment.url_api + 'alert/delete/'+idalert, {});
  }
}
