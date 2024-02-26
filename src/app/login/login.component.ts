import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/api/accountService';
import { User } from 'src/model/user';
import { MyCookieService } from 'src/api/cookieService';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HeaderTitleService } from 'src/service/headerTitle.service';

@Component({
  selector: 'app-wareneinang',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private toastr: ToastrService,
    private userService: AccountService,
    private cookieService: MyCookieService,
    private router: Router,
    private headerTitleService: HeaderTitleService) { }
  username: string = "";
  password: string = "";
  hide = true;
  user: User | undefined;

  LoginForm = new FormGroup({
    NutzernameInput: new FormControl(''),
    PasswordInput: new FormControl(''),
  });

  onChangeUsername(event: any) {
    this.username = event.target.value;
  }

  onChangePassword(event: any) {
    this.password = event.target.value;
  }

  login() {
    this.userService.login(this.username, this.password)
      .subscribe({
        next: data => {
          this.parse(JSON.stringify(data.body!));
          this.cookieService.save("user", this.username);
          this.cookieService.saveSecure("password", this.password);
          this.toastr.success("Login erfolgreich", "");
          this.router.navigate(['/Wareneingang']);
          this.headerTitleService.setTitle(this.username + " - ");
        },
        error: error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler");
          this.router.navigate(['/Wareneingang']);
        }
      })
  }

  logout() {
    this.cookieService.delete("user");
    this.cookieService.delete("password");
  }

  parse(body: string) {
    const tmpUser = JSON.parse(body);
    this.user = {
      username: tmpUser.d.Uname,
      werk: tmpUser.d.Parva
    }
  }

}