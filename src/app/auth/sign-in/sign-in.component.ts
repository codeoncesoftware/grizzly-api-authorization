import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  userObj = { email: '', password: ''};
  token: string;
  errorMessage: string;
  email = '';
  pass = '';
  logged = true;
  error: boolean;
  // Reset Password Section
  emailToSendResetPass: string;
  resetPasswordBool = false;
  successfulReset = false;
  resetErrorMessage = false;
  showEditorButton = false;
  isFr: boolean;
  selectedLanguage: string;
  product = '';

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private appTranslateService: AppTranslateService) {
  }

  ngOnInit() {
    // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }
    this.route.queryParams.subscribe(param => {
      if (param.product === 'grizzly_api') {
        this.showEditorButton = true;
        this.product = param.product;
      }
    });
  }

  setLang(lang: string) {

    this.appTranslateService.setDefaultLang(lang);
    localStorage.setItem('grizzly-lang', lang.toLowerCase());

    if (lang.includes('fr')) {
      this.selectedLanguage = 'FR';
      this.isFr = false;
    } else {
      this.selectedLanguage = 'EN';
      this.isFr = true;
    }

  }

  login() {
    this.userObj.email = this.email;
    this.userObj.password = this.pass;
   
    this.error = false;
    if (this.email && this.pass) {
      console.log(this.email)
         this.authService.login(this.userObj).subscribe(res => {
          if (res) {
            this.logged = true;
            // Save selected language
            localStorage.setItem('grizzly-lang', this.selectedLanguage.toLowerCase());
            // tslint:disable-next-line: no-string-literal
            localStorage.setItem('token', res['access_token']);
            localStorage.setItem('userEmail', this.email);
            localStorage.setItem('anonymos', 'false');

            const ACCESS_TOKEN =  'access_token';
            window.location.href = (environment.grizzlyAPIURL + '?token=' + res[ACCESS_TOKEN] + '&userEmail=' + this.email);
          }
        },
          err => {
            if (err.status === 401) {
              if (err.error === 4011) {
                this.errorMessage = 'auth.signin.errors.credentials';
              }else {
                this.errorMessage = 'auth.signin.errors.validAccount';
              }
              this.logged = false;
            }
          }
        );
    } else {
      this.error = true;
    }

  }

  showResetPassword() {
    this.resetPasswordBool = !this.resetPasswordBool;
    this.successfulReset = false;
  }

  resetPassword() {
    const lang = localStorage.getItem('grizzly-lang');

    if (this.emailToSendResetPass) {
      this.authService.sendResetEmail(this.emailToSendResetPass, lang).subscribe(() => {
        this.successfulReset = true;
        this.resetErrorMessage = false;
      },
        err => {
          if (err.status === 401) {
            if (err.error === 4013) {
              this.successfulReset = false;
              this.resetErrorMessage = true;
            }
          }
        }
      );
    }
  }
}
