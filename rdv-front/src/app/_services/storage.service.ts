import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import jwt_decode from "jwt-decode";

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  key = "L5Clc89@{#}~#{@}]@^";

  constructor() {}

  signOut() {
   window.sessionStorage.clear();

 }

   crypteData(data:any) {
   var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), this.getToken());
   return ciphertext
 }

  decrypteData(data:any) {
   if(data==null || !data)return false
   var bytes  = CryptoJS.AES.decrypt(data.toString(), this.getToken());
   var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
   return decryptedData;
 }

 public saveToken(token: string) {
   //token = this.crypteData(token);
   window.sessionStorage.removeItem(TOKEN_KEY);
   window.sessionStorage.setItem(TOKEN_KEY, token);
 }

 public getToken(): string {
   return sessionStorage.getItem(TOKEN_KEY);
 }

 public saveUser(user) {
   user = this.crypteData(user);
   window.sessionStorage.removeItem(USER_KEY);
   window.sessionStorage.setItem(USER_KEY, user);
 }

 public getUser() {
   return this.decrypteData((sessionStorage.getItem(USER_KEY)));
 }

 public getUserId() {
  this.getUser().id_user;
 }

public getUserRoleId() {
  this.getUser();
}

 public isLoggedIn() {
   return this.getToken()?true:false;
 }

 public isAutorised(idsRolesAutorised:Array<number>) {
     let jwtIdsRoles:Array<number> = this.getUserIdsRoles();
     let found = false;

     idsRolesAutorised.forEach(idRole => {
       if (jwtIdsRoles.includes(idRole) ) {
         found = true;
       }
     });

    return  found;
 }

 public getUserIdsRoles() {
    var ids_roles = [];
    if(this.getToken()!=null && this.getToken()!=""){
      let jwt:any = jwt_decode(this.getToken());
      ids_roles = jwt.ids_roles;
    }

    return ids_roles;
 }

 public generatePassword(pwdLen = 10) {
    const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const randPassword = Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    return randPassword;
 }

 public isOnlyClient(){
   return (this.getUserIdsRoles().includes(2) && this.getUserIdsRoles().length == 1)
 }

 public isOnlyProvider(){
  return (this.getUserIdsRoles().includes(2) && this.getUserIdsRoles().length == 1)
 }

 
}
