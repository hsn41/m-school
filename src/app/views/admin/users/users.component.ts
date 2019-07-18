import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";
import swal from "sweetalert";
import { User } from "./user.model";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private userSubscripton: Subscription;
  private mode = "create";
  private submitBtn = "Submit";
  private id: string;
  private user: User;
  constructor(public userService: UserService, public route: ActivatedRoute) {}

  ngOnInit() {
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has("id")) {
    //     this.mode = "edit";
    //     this.submitBtn = "Update";
    //     this.id = paramMap.get("id");
    //     this.userService.getUser(this.id).subscribe(userData => {
    //       this.user = {
    //         id: userData.id,
    //         email: userData.email,
    //         role: userData.role,
    //         status: userData.status,
    //         password: userData.password
    //       };
    //     });
    //   }
    // });
    this.userService.getUsers();
    this.userSubscripton = this.userService
      .getUserUpdateListner()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }
  onAddUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.userService.onSave(
      form.value.email,
      form.value.password,
      form.value.role,
      form.value.status
    );
    swal("Great!", "Created successfully!", "success");

    form.resetForm();
  }
  ngOnDestroy() {
    this.userSubscripton.unsubscribe();
  }

  onDelete(id: string) {
    console.log(id);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", true]
    }).then(willDelete => {
      if (willDelete) {
        this.userService.onDelete(id);
        swal("Poof! User has been deleted!", {
          icon: "success"
        });
      } else {
        swal("Student Data is safe!");
      }
    });
  }
}
