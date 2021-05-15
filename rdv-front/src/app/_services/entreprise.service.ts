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

export class EntrepriseService {

  constructor(private http: HttpClient) { }

    searching(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"entreprise/searching/?"+params);
    }

    create(user): Observable<any> {
      return this.http.post(environment.url_api + 'entreprise/create', user , httpOptions);
    }

    update(user): Observable<any> {
      return this.http.put(environment.url_api + 'entreprise/update/'+user.id, user, httpOptions);
    }

    delete(entrepriseId): Observable<any> {
      return this.http.delete(environment.url_api + 'entreprise/delete/'+entrepriseId, {});
    }

    search(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"entreprise/search/?"+params);
    }

    getProviderAssociedClient(data): Observable<any> {
      let params = "";
      Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
      params = params.slice(0, -1);
      return this.http.get(environment.url_api+"entreprise/getProviderAssociedClient/?"+params);
    }

    associateProvider(ids_provider): Observable<any> {
      return this.http.post(environment.url_api + 'entreprise/associateProvider', ids_provider , httpOptions);
    }

    
} 
