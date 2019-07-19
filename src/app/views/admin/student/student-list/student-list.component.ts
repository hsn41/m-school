import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Student } from "../student.model";
import { Router, ActivatedRoute } from "@angular/router";
import { StudentService } from "../student.service";

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
}
