import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from '../Modules/login.module/login.module';
import { MainModule } from '../Modules/main.module/main.module';
import { Crypter } from 'src/services/crypter.service';
import { CommonModule } from '@angular/common';
import { BREAKPOINT, FlexLayoutModule, DEFAULT_BREAKPOINTS } from '@angular/flex-layout';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { unathorizedComponent } from 'src/app/Components/ui.components/unathorized.component/unathorized.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../Modules/shared.module/shared.module';

const JWT_Module_Options: JwtModuleOptions = {
  config: {
      tokenGetter:(() => Crypter.getItem("SESSION")["access_token"]) ,
      allowedDomains : ["localhost","127.0.0.1:8080","apiscada.herokuapp.com"],
      headerName: "Authorization",
      authScheme: "Bearer ",
      throwNoTokenError:false
  }
};

export function tokenGetter(){
  return Crypter.getItem("SESSION")["access_token"];
}
 
@NgModule({
  declarations: [
    AppComponent, unathorizedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    JwtModule.forRoot(JWT_Module_Options),
    AppRoutingModule
  ],
  providers: [Crypter,{provide:BREAKPOINT,useValue:DEFAULT_BREAKPOINTS,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }



declare global{
  interface String {
      format(...args: any[]) : string
  }
}   

String.prototype.format = function(...args: any[]) {
  let a:string;
  a = this;
  for (let k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}
