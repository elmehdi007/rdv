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
export class RoleService {

  constructor(private http: HttpClient) { }

  search(data): Observable<any> {
    let params = "";
    Object.keys(data).forEach(function (key) {params+=key+"="+data[key]+"&";});
    params = params.slice(0, -1);
    return this.http.get(environment.url_api+"role/search/?"+params);
  }

  create(role): Observable<any> {
       return this.http.post(environment.url_api + 'role/create', role, httpOptions);
   }

   update(role): Observable<any> {
      return this.http.put(environment.url_api + 'role/update/'+role.id, role, httpOptions);
  }

  delete(idRole): Observable<any> {
     return this.http.delete(environment.url_api + 'role/delete/'+idRole, {});
  }

  addRolesToUser(body): Observable<any> {        console.log(body);
        return this.http.post(environment.url_api + 'role/link-roles-to-user', body, httpOptions);
  }

}
