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
  private token: string;
  private isAuthenticated = true;

  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}
  getToken() {
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
      .post<{ token: string }>(
        "http://localhost:3000/api/users/login",
        userData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        console.log("User service" + token);
        if (token) {
          this.isAuthenticated = true;
          console.log(this.isAuthenticated);
          this.authStatusListner.next(true);
        }
      });
  }
}
