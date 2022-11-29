import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './authentication/signin/signin.component';
import { AuthGuard } from './authentication/_helpers/auth.gaurd';
import { MainComponent } from './layout/main/main.component';

const routes: Routes = [
  {
    path:'',
    component: SigninComponent
  },
  {
    path:'home',
    component: MainComponent,
    canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
