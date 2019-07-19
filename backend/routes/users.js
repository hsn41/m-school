const express = require("express");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/api/users", (req, res, next) => {
  User.find()
    .then(document => {
      res.status(200).json({ message: "Users Fetched", users: document });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

router.post("/api/users", (req, res, next) => {
  console.log("bacledm");
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      status: req.body.status,
      role: req.body.role
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User Created",
          result: result
        });
      })
      .catch(error => {
        res.status(500).json({
          error: error
        });
      });
  });
});
router.get("/api/users/:userId", (req, res, next) => {
  console.log(userId);
  User.findById(req.params.userId).then(user => {
    if (user) {
      console.log(user);
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User Not Existing" });
    }
  });
});
router.delete("/api/users/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json({ message: result });
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

router.post("/api/users/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed!"
        });
      }
      fetchedUser = user;

      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed!"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "12345",
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: token, expiresIn: 3600 });
    })
    .catch(error => {
      console.log(error);
      return res.status(501).json({ error: error });
    });
});

module.exports = router;
