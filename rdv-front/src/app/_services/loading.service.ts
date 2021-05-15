import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading = new BehaviorSubject<boolean>(false);
  currentState = this.isLoading.asObservable();

  constructor() {}

  changeCurrentStateSideBare(state: boolean) { this.isLoading.next(state) }

}
