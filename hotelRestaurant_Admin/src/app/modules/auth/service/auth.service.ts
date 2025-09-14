import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../services/api-config.service';
import { Confirmation, CustomerSignUpModel, Register, SignInModel, SignUpModel } from '../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient, private apiConfig: ApiConfigService) { }
//Arreglar este solo lo copie 

 // ----------- AUTH -----------
 
  signIn(signInModel: SignInModel): Observable<any> {
    return this.http.post<any>(`${this.apiConfig.API_AUTH}/sign-in`, signInModel);
  }

  // ----------- Registro -----------
  signUp(registro: Register): Observable<any> {
    return this.http.post<any>(`${this.apiConfig.API_AUTH}/sign-up`, registro);
  }

   confirmation(confirmation: Confirmation): Observable<any> {
        return this.http.put<any>(`${this.apiConfig.API_AUTH}/sign-up`, confirmation);
    }

}

