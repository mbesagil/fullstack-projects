import httpStatus from "http-status";

import {
  insert,
  findAll,
  findOne,
  modify,
  remove,
} from "../services/Stories.js";

const index = (req, res) => {
  const userId = req.user._id;
  findOne({ _id: userId })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error));
};

const getAll = (req, res) => {
  req.body.userId = req.user._id;
  const page = req.body.page || 1; // Varsayılan olarak 1. sayfa
  const limit = req.body.limit || 5; // Varsayılan olarak 5 kayıt
  const skip = (page - 1) * limit;

  findAll({ ...req.body, skip })
    .then((response) => res.status(httpStatus.OK).send(response))
    .catch((error) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error));
};

const create = async (req, res) => {
  const userId = req.user._id;
  insert({ ...req.body, author: userId })
    .then((response) => res.status(httpStatus.CREATED).send(response))
    .catch((err) => res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err));
};

const update = (req, res) => {
  modify({ _id: req.params.id }, req.body)
    .then((updatedUser) => res.status(httpStatus.OK).send(updatedUser))
    .catch(() => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Error occurred during update" });
    });
};

const deleteStory = (req, res) => {
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

export { create, index, update, deleteStory, getAll };
