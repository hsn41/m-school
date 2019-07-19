const jwt = require("jsonwebtoken");
console.log("testing1");

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "12345");
    console.log(token);
    console.log("testing1");

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ message: "Auth failed!" });
  }
};
