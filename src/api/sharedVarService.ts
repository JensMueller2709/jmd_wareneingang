import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedVarService {
  private username: BehaviorSubject<string>;
  constructor() {
    this.username = new BehaviorSubject<string>("");
  }

  setValue(newValue : any): void {
    this.username.next(newValue);
  }

  getValue(): Observable<string> {
    return this.username.asObservable();
  }
}