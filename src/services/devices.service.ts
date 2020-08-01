import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Workspace, Variable } from '../models/workspace';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: "root"
})

export class DevicesService{

    //private URL:string = "http://127.0.0.1:8080/Controles/{0}";
    private URL:string = "https://apiscada.herokuapp.com/Controles/{0}";

    constructor(private HTTP_CLIENT: HttpClient,private AUTH_SERVICE: AuthService){}


    public obtenerProyectos(): Observable<any>{
        return this.HTTP_CLIENT.get(this.URL.format("MostrarTodos"));
    }

    public abrirProyecto(Id:String): Observable<Workspace>{
        return this.HTTP_CLIENT.get(this.URL.format("Abrir/{0}".format(Id))).pipe(
            map( (item:Workspace) => new Workspace(item))
        ) ;
    }

    public LeerSensor(Id:string,token:string,variables:Variable[]): Observable<any>{
        return this.HTTP_CLIENT.post<Variable[]>(this.URL.format("LeerSensor/{0}/{1}".format(Id,token)),variables.map( (v) => v.toJSON() ) ).pipe(
            map( (v:Variable[]) => v.map((v) => new Variable(v)) )
        );
    }



}