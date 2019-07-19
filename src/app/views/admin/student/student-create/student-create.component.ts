import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { Student } from "../student.model";
import { NgForm } from "@angular/forms";
import { StudentService } from "../student.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: "app-student-create",
  templateUrl: "./student-create.component.html",
  styleUrls: ["./student-create.component.scss"]
})
export class StudentCreateComponent implements OnInit {
  enteredName = "";
  enteredEmail = "";
  enteredMobileNumber = "";
  enteredCountry = "";
  enteredStreet = "";
  enteredPostalCode = "";
  enteredCity = "";
  isLoading = true;
  private mode = "create";
  private submitBtn = "Submit";
  private studentId: string;
  private student: Student;
  @Output() studentCreated = new EventEmitter<Student>();
  constructor(
    public studentService: StudentService,
    public route: ActivatedRoute
  ) {}

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode == "create") {
      this.studentService.addStudent(
        form.value.name,
        form.value.mobile_number,
        form.value.email,
        form.value.street,
        form.value.city,
        form.value.postal_code,
        form.value.country
      );
    } else {
      this.mode == "edit";
      console.log(JSON.stringify(form.value));
      this.studentService.updatePost(
        this.studentId,
        form.value.name,
        form.value.mobile_number,
        form.value.email,
        form.value.street,
        form.value.city,
        form.value.postal_code,
        form.value.country
      );
      swal("Great!", "updated successfully!", "success");
    }

    form.resetForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("studentId")) {
        this.mode = " edit";
        this.submitBtn = "Update";
        this.studentId = paramMap.get("studentId");
        this.isLoading = false;
        this.studentService
          .getStudent(this.studentId)
          .subscribe(studentData => {
            this.student = {
              id: studentData._id,
              name: studentData.name,
              mobile_number: studentData.mobile_number,
              email: studentData.email,
              country: studentData.country,
              street: studentData.street,
              city: studentData.city,
              postal_code: studentData.postal_code
            };
          });
      } else {
        this.mode = " create";

        this.studentId = null;
        this.isLoading = false;
      }
    });
  }
}
