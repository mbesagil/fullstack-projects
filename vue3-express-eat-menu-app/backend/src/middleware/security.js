const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const jwtSecretKey = process.env.ACCESS_TOKEN_KEY;

// const authenticate = (req, res, next) => {
//   const token = req.header("Authorization");
//   console.log('token :>> ', token);
//   if (!token) {
//     return res.status(401).json({ message: "Kimlik doğrulama başarısız.1" });
//   }
//   try {
//     const decoded = jwt.verify(token, jwtSecretKey);
//     console.log('decoded :>> ', decoded);
//     // req.user = decoded.user;
//     // console.log('req.user :>> ', req.user);
//     next();
//   } catch (error) {
//     console.log('error :>> ', error);
//     return res.status(401).json({ message: "Kimlik doğrulama başarısız." });
//   }
// };

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  console.log("Received token: ", token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided." });
  }

  try {
    const formattedToken = token.split(" ")[1]; // Assuming token format is "Bearer <token>"
    console.log("Formatted token: ", formattedToken);

    const decodedUser = jwt.verify(formattedToken, jwtSecretKey);
    // console.log("Decodekd payload: ", decodedUser);

    req.user = decodedUser;
    console.log('req.user: ', req.user);
    next();
  } catch (error) {
    console.error("Error verifying token: ", error);
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token." });
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = { authenticate, validate };
