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

export class UserService {

  constructor(private http: HttpClient) { }

  login(user): Observable<any> {
       return this.http.post(environment.url_api + 'user/authenticate', {
         email: user.email,
         password: user.password,
     }, httpOptions);
   }

   searching(data): Observable<any> {
     let params = "";
     Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
     params = params.slice(0, -1);
     return this.http.get(environment.url_api+"user/searching/?"+params);
   }

   search(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {if(data[key]!=null&&data[key]!="")params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"user/search/?"+params);
  }

   create(user): Observable<any> {
        return this.http.post(environment.url_api + 'user/register', user , httpOptions);
    }

    update(user): Observable<any> {
        return this.http.put(environment.url_api + 'user/update/'+user.id, user, httpOptions);
    }

    updateFile(user): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        return this.http.post(environment.url_api + 'user/update-avatar/'+user.get("id"), user,{headers: headers});
    }

    updatePassword(user): Observable<any> {
        return this.http.put(environment.url_api + 'user/update-password/'+user.id, user, httpOptions);
    }

    delete(idUser): Observable<any> {
       return this.http.delete(environment.url_api + 'user/delete/'+idUser, {});
    }

    getUserRoles(data): Observable<any> {
        let params = "";
        Object.keys(data).forEach(function (key) {params+=key+"="+data[key]+"&";});
        params = params.slice(0, -1);
        return this.http.get(environment.url_api+"user/get-user-roles/?"+params);
    }
}
