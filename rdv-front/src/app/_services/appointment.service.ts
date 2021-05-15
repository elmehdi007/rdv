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

export class AppointmentService {

  constructor(private http: HttpClient) { }

    create(user): Observable<any> {
      return this.http.post(environment.url_api + 'appointment/create', user , httpOptions);
    }

    update(user): Observable<any> {
      return this.http.put(environment.url_api + 'appointment/update/'+user.id, user, httpOptions);
    }

    delete(appointmentId): Observable<any> {
      return this.http.delete(environment.url_api + 'appointment/delete/'+appointmentId, {});
    }

    search(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"appointment/search/?"+params);
    }

    searching(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"appointment/searching/?"+params);
    }

    getProviderAssociedClient(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"appointment/getProviderAssociedClient/?"+params);
    }

    associateProvider(ids_provider): Observable<any> {
      return this.http.post(environment.url_api + 'appointment/associateProvider', ids_provider , httpOptions);
    }
    
    makeClef(length=5) {
        var result           = [];
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
      }
    
    return result.join('');
    }
} 
