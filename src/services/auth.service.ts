import { Injectable } from '@angular/core'
import { Crypter } from './crypter.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { indexedDB } from './indexedDB.service';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: "root"
})

export class AuthService{

    //private URL:string = "http://127.0.0.1:8080/Sesion/{0}";
    private URL:string = "https://apiscada.herokuapp.com/Sesion/{0}";

    constructor( private HTTP: HttpClient, private JWTHelper: JwtHelperService, private ROUTER: Router, private indexedDB: indexedDB){
        
    }
    
    public iniciarSesion(USER:object): Observable<Object>{
            return this.HTTP.post(this.URL.format("IniciarSesion"),{
                                                                    Usuario: USER['USER_NAME'],
                                                                    Password: USER['USER_PASSWORD'] 
                                                                    });
    }

    public AUTHENTICATED() : Boolean {
        return !this.JWTHelper.isTokenExpired()
    }

    public setSession(SESSION:any){
        Crypter.SECURE_STORAGE.setItem("SESSION",SESSION)
    }

    public getSession(){
        return !isNullOrUndefined(Crypter.SECURE_STORAGE.getItem("SESSION")) ? Crypter.SECURE_STORAGE.getItem("SESSION") : {}
    }

    public accessToken(){
        return !isNullOrUndefined(Crypter.SECURE_STORAGE.getItem("SESSION")) ? Crypter.SECURE_STORAGE.getItem("SESSION")["access_token"] : {"access_token":null}
    }

    public deleteSession(){
        Crypter.SECURE_STORAGE.clear()
        this.indexedDB.cleanWorkSpace()
        Crypter.generateKeys()
    }

}