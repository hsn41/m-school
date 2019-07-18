import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Student } from "../student.model";
import { Router, ActivatedRoute } from "@angular/router";
import { StudentService } from "../student.service";
import swal from "sweetalert";

@Component({
  selector: "app-post-list",
  templateUrl: "./student-list.component.html",
  styleUrls: ["./student-list.component.scss"]
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  private studentsSub: Subscription;
  isLoading = false;
  constructor(
    public studentService: StudentService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.studentService.getStudents();
    this.studentsSub = this.studentService
      .getPostUpdateListener()
      .subscribe((students: Student[]) => {
        this.isLoading = false;
        this.students = students;
      });
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
  }
  onDelete(studentId: string) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this student!",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", true]
    }).then(willDelete => {
      if (willDelete) {
        this.studentService.deleteStudent(studentId);
        swal("Poof! Student has been deleted!", {
          icon: "success"
        });
      } else {
        swal("Student Data is safe!");
      }
    });
  }
}
