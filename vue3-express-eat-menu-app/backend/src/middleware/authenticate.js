const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  console.log("istek authenticate ediliyor ...");
  //get token data req
  const authHeader = req.headers["authorization"];
  //toke data
  const token = authHeader && authHeader.split(" ")[1];
  //if null token data send error
  if (token === null) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: "this proccess than before login " });
  }
  // console.log(token);
  // console.log('token :>> ', token);

  //verify jwt token for authenticate
  JWT.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) return res.status(httpStatus.FORBIDDEN).send({ error: err });

    // console.log("user :>> ", user);
    //user infermation get req.user;
    req.user = user.dataValues || user;
    console.log("req.user :>> ", req.user.id);
    next();
  });
};

module.exports = authenticateToken;
