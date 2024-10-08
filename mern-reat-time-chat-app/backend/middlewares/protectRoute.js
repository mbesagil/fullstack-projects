import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token)
      res.status(401).send({ error: "Unauthorized  : No Token Provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded)
      res.status(401).send({ error: "Unauthorized  : Invalid Token" });

    const user = await User.findById(decoded.userId);
    if (!user) res.status(404).send({ error: "User Not Found" });


    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectRoute middleware  :>> ", error);
    return res.status(404).send({ error: "Internal Server Error " });
  }
};

export default protectRoute;
