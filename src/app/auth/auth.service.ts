import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router, private translateService: TranslateService) { }

  login(userObj) {
    return this.http.post<string>(this.baseUrl + '/api/auth/login', userObj, { responseType: 'json' });
  }

  logout() {
    this.http.get<boolean>(this.baseUrl + '/api/auth/logout').subscribe(res => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }

  signup(userObj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': this.translateService.getDefaultLang()
    });
    return this.http.post<string>(this.baseUrl + '/api/auth/signup', userObj, { headers });
  }

  check(email: string) {
    return this.http.get<boolean>(this.baseUrl + '/api/auth/check/' + email);
  }

  sendResetEmail(email: string, lang: string) {
    const headers = new HttpHeaders({
      'Accept-Language': lang
    });
    return this.http.get(this.baseUrl + '/api/auth/send/reset/password/' + email, { headers });
  }

  resetPassword(token, password) {
    return this.http.post(this.baseUrl + '/api/auth/reset/password/' + token, { password });
  }

  confirmEmail(token) {
    return this.http.get(this.baseUrl + '/api/auth/confirm/email/' + token);
  }
  checkToken(token): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/api/auth/check/token/' + token);
  }
}
