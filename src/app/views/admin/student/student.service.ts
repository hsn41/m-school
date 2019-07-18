import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Student } from "./student.model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class StudentService {
  private students: Student[] = [];
  private studentsUpdated = new Subject<Student[]>();
  constructor(private http: HttpClient, private router: Router) {}
  getStudents() {
    this.http
      .get<{ message: string; students: any }>(
        "http://localhost:3000/api/students"
      )
      .pipe(
        map(postData => {
          return postData.students.map(student => {
            return {
              id: student._id,
              name: student.name,
              country: student.country,
              email: student.email,
              mobile_number: student.mobile_number,
              street: student.street,
              city: student.city,
              postal_code: student.postal_code
            };
          });
        })
      )
      .subscribe(transformedData => {
        this.students = transformedData;
        this.studentsUpdated.next([...this.students]);
      });
  }

  getPostUpdateListener() {
    return this.studentsUpdated.asObservable();
  }

  addStudent(
    name: string,
    mobile_number: string,
    email: string,
    street: string,
    city: string,
    postal_code: string,
    country: string
  ) {
    const student: Student = {
      id: null,
      name: name,
      mobile_number: mobile_number,
      email: email,
      street: street,
      city: city,
      postal_code: postal_code,
      country: country
    };

    this.http
      .post<{ message: string; studentId: string }>(
        "http://localhost:3000/api/students",
        student
      )
      .subscribe(responseData => {
        const id = responseData.studentId;
        student.id = id;
        this.students.push(student);
        this.studentsUpdated.next([...this.students]);
      });
  }
  updatePost(
    id: string,
    name: string,
    email: string,
    mobile_number: string,
    postal_code: string,
    street: string,
    city: string,
    country: string
  ) {
    const student: Student = {
      id: id,
      name: name,
      email: email,
      mobile_number: mobile_number,
      postal_code: postal_code,
      street: street,
      city: city,
      country: country
    };
    console.log(JSON.stringify(student));
    this.http
      .put("http://localhost:3000/api/students/" + id, student)
      .subscribe(response => {
        const updateStudents = [...this.students];
        const oldStudentIndex = updateStudents.findIndex(
          s => s.id === student.id
        );
        updateStudents[oldStudentIndex] = student;
        this.students = updateStudents;
        this.studentsUpdated.next([...this.students]);
        this.router.navigate(["/students"]);
      });
  }
  getStudent(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      mobile_number: string;
      postal_code: string;
      street: string;
      city: string;
      country: string;
    }>("http://localhost:3000/api/students/" + id);
  }

  deleteStudent(studentId: string) {
    this.http
      .delete("http://localhost:3000/api/students/" + studentId)
      .subscribe(() => {
        const studentsUpdated = this.students.filter(
          student => student.id !== studentId
        );
        this.students = studentsUpdated;
        this.studentsUpdated.next([...this.students]);
      });
  }
}
