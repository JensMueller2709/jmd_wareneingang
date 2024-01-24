import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { WareneinangComponent } from './wareneinang/wareneinang.component';
import { AccountService } from 'src/api/accountService';
import { MyCookieService } from 'src/api/cookieService';
import { OrderService } from 'src/api/orderService';
import {CookieService} from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialService } from 'src/api/materialService';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { HeaderTitleService } from 'src/service/headerTitle.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WareneinangComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
}),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [AccountService, OrderService, CookieService, MyCookieService, MaterialService, HeaderTitleService, {provide : LocationStrategy , useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
