import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '../services/loading.service';
import { ErrorService } from '../services/error.service';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private errorService: ErrorService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.show();
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
