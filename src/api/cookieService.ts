import { CookieService } from 'ngx-cookie-service'
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class MyCookieService {

    constructor(private cookieService: CookieService) { }

    password = "jsakhlfiwoahfweklFJHEWIFJEWIOFHWEFHI124124*2";

    save(key: string, value: string) {
        let expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() + 30);
        this.cookieService.set(key, value, expiredDate);
    }

    saveSecure(key: string, value: string) {
        let encryptedValue = this.encrypt(value);
        this.save(key, encryptedValue);
    }

    getSecure(key: string): string {
        let encryptedValue = this.get(key);
        let decryptedValue = this.decrypt(encryptedValue);
        return decryptedValue;
    }

    get(key: string): string {
        return this.cookieService.get(key);
    }

    check(key: string) {
        return this.cookieService.check(key);
    }

    delete(key: string) {
        this.cookieService.delete(key);
    }

    encrypt(message: string) {
        let encryptedMessage = CryptoJS.AES.encrypt(message.trim(), this.password.trim()).toString();
        return encryptedMessage;
    }

    decrypt(encryptedMessage: string) {
        let decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, this.password.trim()).toString(CryptoJS.enc.Utf8);
        return decryptedMessage;
    }
}