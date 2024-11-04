import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { HeaderTitleService } from 'src/service/headerTitle.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private cookieService: CookieService, 
    private router: Router, 
    private headerTitleService: HeaderTitleService) {
  }
  userName : string = "";
  title = "";
  env = ""

  ngOnInit() {
    this.userName = this.cookieService.get("user");
    this.headerTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
    this.headerTitleService.setTitle(this.userName)
    this.env = environment.name;
  }

  logout(){
    this.cookieService.delete("user");
    this.cookieService.delete("password");
    this.router.navigate(['/Login']);
    this.userName ="";
    this.headerTitleService.setTitle(this.userName);
  }

 
}
