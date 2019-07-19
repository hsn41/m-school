import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "./users/user.model";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();
  public token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
    console.log(this.token);
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }
  onSave(email: string, password: string, role: string, status: string) {
    const user: User = {
      id: null,
      email: email,
      password: password,
      role: role,
      status: status
    };

    this.http
      .post<{ message: string; userId: string }>(
        "http://localhost:3000/api/users",
        user
      )
      .subscribe(response => {
        const id = response.userId;
        user.id = id;
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
        console.log(response);
      });
  }
  getUsers() {
    this.http
      .get<{ message: string; users: any }>("http://localhost:3000/api/users")
      .pipe(
        map(userData => {
          return userData.users.map(users => {
            return {
              id: users._id,
              email: users.email,
              role: users.role,
              status: users.status
            };
          });
        })
      )
      .subscribe(transformedData => {
        this.users = transformedData;
        this.usersUpdated.next([...this.users]);
      });
  }
  getUserUpdateListner() {
    return this.usersUpdated.asObservable();
  }
  getUser(id: string) {
    console.log(id);

    return this.http.get<{
      id: string;
      email: string;
      password: string;
      role: string;
      status: string;
    }>("http://localhost:3000/api/users/" + id);
  }
  onDelete(id: string) {
    this.http.delete("http://localhost:3000/api/users/" + id).subscribe(() => {
      const usersUpdated = this.users.filter(user => user.id !== id);
      this.users = usersUpdated;
      this.usersUpdated.next([...this.users]);
    });
  }
  onLogin(email: string, password: string) {
    const userData: User = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        "http://localhost:3000/api/users/login",
        userData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log(this.token);
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 50);
          this.isAuthenticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);

          this.router.navigate(["/"]);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
