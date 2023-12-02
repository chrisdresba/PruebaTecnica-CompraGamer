import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private service: SpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.service.show(); // Activa el spinner

    return next.handle(req).pipe(
      finalize(() => {
        setTimeout(() => {
          this.service.hide();
        }, 400); // Desactiva el spinner
      })
    );
  }
}
