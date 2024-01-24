import {CookieService} from 'ngx-cookie-service'
import { Injectable } from '@angular/core';

@Injectable()
export class MyCookieService{

    constructor(private cookieService: CookieService) { }

    save(key:string, value:string, secure:boolean = false){
        let expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 30);
        this.cookieService.set(key, value, expiredDate);
    }

    get(key:string):string{
        return this.cookieService.get(key);
    }

    check(key:string){
        return this.cookieService.check(key);
    }

    delete(key:string) {
        this.cookieService.delete(key);
    }
}