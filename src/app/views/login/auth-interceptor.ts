import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../admin/user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();

    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer" + authToken)
    });
    console.log("auth inerceptoor:  " + JSON.stringify(authRequest));

    return next.handle(authRequest);
  }
}
