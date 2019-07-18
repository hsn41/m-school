import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "../../../../backend/models/users";
import { UserService } from "../admin/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html"
})
export class LoginComponent {
  constructor(public userSerive: UserService) {}
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.userSerive.onLogin(form.value.email, form.value.password);
    }
  }
}
