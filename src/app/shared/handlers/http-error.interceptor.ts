import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // tslint:disable-next-line:max-line-length
        if (!request.url.includes('/api/auth/login') &&
            !request.url.includes('/api/auth/signup') &&
            !request.url.includes('/api/auth/confirm') &&
            !request.url.includes('/api/auth/send/reset/password') &&
            !request.url.includes('/api/auth/check/token') &&
            !request.url.includes('/api/auth/reset/password')
        ) {
            request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
            });
        }



        // handle response status
        return next.handle(request)
            .pipe(
                catchError((err) => {
                    const toastr = this.injector.get(ToastrService);
                    if (err.status === 302) {
                        // Resource found but it is DUPLICATED
                    } else if (err.status === 400) {

                    } else if (err.status === 401) {
                        if (err.error.error === 'invalid_token' || err.error.error === 'unauthorized') {
                            localStorage.removeItem('userEmail');
                            localStorage.removeItem('token');
                            this.router.navigate(['/login']);
                        }
                    } else if (err.status === 404) {

                        if (!this.router.url.includes('/editor')) {
                            this.router.navigate(['/login']);
                        }

                    } else if (err.status === 403) {
                        toastr.error('', 'RESOURCE NOT AUTHORIZED', {
                            tapToDismiss: true,
                        });
                        this.router.navigate(['/login']);
                    } else if (err.status === 406) {
                        if (err.error && err.error === 4061) {
                            // Wrong DataSource Details
                        } else {
                            // Transformation with no XML Content
                            toastr.error(err.error, '', {
                                tapToDismiss: true,
                                positionClass: 'toast-top-left',
                                progressBar: true,
                            });
                        }

                    } else { // SERVER ERROR 5**
                        toastr.error('Server cannot be reached', 'COULD NOT CONNECT TO THE SERVER', {
                            tapToDismiss: true,
                            positionClass: 'toast-top-full-width',
                            progressBar: true,
                        });
                    }
                    return throwError(err);
                })
            );
    }
}
