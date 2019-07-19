const express = require("express");
const Student = require("../models/student");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
router.post("/api/students", checkAuth, (req, res, next) => {
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    postal_code: req.body.postal_code
  });

  student.save().then(createtStudent => {
    res.status(201).json({
      message: "Post added successfully",
      studentId: createtStudent._id
    });
  });
});

router.get("/api/students", checkAuth, (req, res, next) => {
  Student.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      students: documents
    });
  });
});
router.get("/api/students/:studentId", checkAuth, (req, res, next) => {
  Student.findById(req.params.studentId).then(student => {
    if (student) {
      // console.log(JSON.stringify(student));
      res.status(200).json(student);
    } else {
      console.log("Error");
      res.status(404).json({ message: "Student Not Found" });
    }
  });
});
router.put("/api/students/:id", (req, res, next) => {
  const student = new Student({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    postal_code: req.body.postal_code
  });
  console.log("Bd");
  Student.updateOne({ _id: req.params.id }, student).then(result => {
    res.status(200).json({ message: "Update Successfully" });
  });
});
router.delete("/api/students/:studentId", (req, res, next) => {
  console.log(req.params.studentId);
  Student.deleteOne({ _id: req.params.studentId }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Student Deleted" });
  });
});
module.exports = router;
