import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private srv: StorageService, private router: Router) { }
  canActivate(): boolean {
    if (this.srv.isLoggedIn()) {
      return true
    }
    else {
      this.router.navigate(['/login'])
      return false
    }
  }
}
