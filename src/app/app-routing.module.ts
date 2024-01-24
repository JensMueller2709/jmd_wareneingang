import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WareneinangComponent } from './wareneinang/wareneinang.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [ 
  {path: '', redirectTo: '/Wareneingang', pathMatch: 'full'},
  {path: 'Wareneingang' , component: WareneinangComponent},
  {path: 'Login' , component: LoginComponent},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
