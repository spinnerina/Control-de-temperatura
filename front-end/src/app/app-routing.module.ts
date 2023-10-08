import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './panel/login/login.component';
import { AuthGuard } from './guard/Login/auth.guard';
import { HomeComponent } from './panel/home/home.component';
import { HeaderComponent } from './panel/header/header.component';
import { TiempoRealComponent } from './panel/tiempo-real/tiempo-real.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path:'login', component: LoginComponent},
  {path:'header', component: HeaderComponent},
  {path:'tiempoReal', component: TiempoRealComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
