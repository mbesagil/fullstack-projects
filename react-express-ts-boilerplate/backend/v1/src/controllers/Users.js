import httpStatus from "http-status";

import {
  insert,
  findOne,
  loginUser,
  modify,
  remove,
} from "../services/Users.js";

import {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} from "../scripts/utils/helper.js";
import { verifyToken } from "../middlewares/authenticate.js";

const index = (req, res) => {
  const userId = req.user._id;
  findOne({ _id: userId })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error));
};

const create = async (req, res) => {
  const alreadyUser = await findOne({ email: req.body.email });
  if (alreadyUser != null) {
    return res
      .status(httpStatus.CONFLICT)
      .send({ success: false, message: "User Already Exist" });
  }

  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => res.status(httpStatus.CREATED).send(response))
    .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ success: false, message: "User Not Found!" });
      }

      user = {
        user_id: user._id,
        token: {
          access_token: generateAccessToken(user),
          refresh_token: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).send({ user: user, message: "Success Login" });
    })
    .catch((e) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e));
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => res.status(httpStatus.OK).send(updatedUser))
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Error occurred during password change" });
    });
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => res.status(httpStatus.OK).send(updatedUser))
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Error occurred during update" });
    });
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "Id information missing" });
  }

  remove(req.params?.id)
    .then((deleteUser) => {
      if (!deleteUser) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "User not found" });
      }
      res
        .status(httpStatus.OK)
        .send({ message: `User ${deleteUser?.full_name} deleted` });
    })
    .catch((e) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Error occurred during record deletion" })
    );
};

const validateToken = (req, res) => {
  const token = req.body.token || "";
  const verifyUser = verifyToken(token);
  if (verifyUser.error) {
    return res.status(httpStatus.FORBIDDEN).send({ error: verifyUser.error });
  }
  return res
    .status(httpStatus.OK)
    .send({
      message: "User validated successfully",
      success: true,
      data: verifyUser,
    });
};

export {
  create,
  index,
  login,
  changePassword,
  update,
  deleteUser,
  validateToken,
};
