import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from '../token/token-service';
import { User } from './user-interface';
import * as jtw_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userSubject = new BehaviorSubject<User>(null);
    private userName: string;

    constructor(private tokenService: TokenService){ 
       this.tokenService.hasToken() && //Verifico se há token no momento que chamar o serviço
       this.DecodificarToken();

    }

    setToken(token: string){
        this.tokenService.setToken(token);
        this.DecodificarToken();
    }

    getUser(){
        return this.userSubject.asObservable(); //Retorno um observable aonde é possível dar subscribe para conseguir as informações
    }

    private DecodificarToken(){
        const token = this.tokenService.getToken(); //Pego o token salvo
        const user = jtw_decode(token) as User; //Decodifico este token identificando as propriedades do mesmo baseado na interface User
        this.userName = user.name;
        this.userSubject.next(user); //Atribuo o resultado ao subject do tipo User
    }

    logout(){
        this.tokenService.removeToken(); //Removo o token
        this.userSubject.next(null); //Atribuo null ao subject
    }

    isLogged(){
        return this.tokenService.hasToken();
    }

    getUserName(){
        return this.userName;
    }

}