const {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
} = require("../util/helper");

const BaseController = require("./BaseController");
const UsersService = require("../services/UsersService");
const baseService = new UsersService();

class UsersController extends BaseController {
  constructor() {
    super("a");
    // let a = new UsersService();
    // this.usersService = a;
  }

  async getOne(req, res) {
    console.log("getOne", req.params.id);
    return await baseService
      .findOne({ where: { id: req.params.id } })
      .then((response) => {
        console.log("res :>> ", response);
        if (response.err) {
          return res
            .status(500)
            .send({ err: response.err, message: "have a error" });
        }
        return res.status(200).send({ data: response, message: "Successfuly" });
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }

  async list(req, res) {
    console.log("baseService :>> ", baseService);
    console.log("req.body :>> ", req.body);
    return await baseService
      .list(req.body)
      .then((response) => {
        // console.log("res :>> ", response);
        if (response.err) {
          return res
            .status(500)
            .send({ err: response.err, message: "have a error" });
        }
        return res.status(200).send({
          data: response.data,
          total: response.total,
          message: "Successfuly",
        });
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }

  async update(req, res) {
    if (!req.params.id) {
      return res.status(500).send({ message: "Eksik parametre" });
    }
    req.body.password = passwordToHash(req.body.password);
    return await baseService
      .update(req.body, req.params.id)
      .then((response) => {
        console.log("res :>> ", response);
        if (response.err) {
          return res
            .status(500)
            .send({ err: response.err, message: "have a error" });
        }
        return res.status(200).send({ data: response, message: "Successfuly" });
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }

  async deleteItem(req, res) {
    if (!req.params.id) {
      return res.status(500).send({ message: "Eksik parametre" });
    }
    return await baseService
      .delete(req.params.id)
      .then((response) => {
        console.log("res :>> ", response);
        if (response.err) {
          return res
            .status(500)
            .send({ err: response.err, message: "have a error" });
        }
        return res.status(200).send({ message: "Successfuly" });
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }

  //override
  async create(req, res) {
    req.body.password = passwordToHash(req.body.password);
    console.log("req.body :>> ", req.body);
    return await this.usersService
      .create(req.body)
      .then((response) => {
        // console.log("res :>> ", response);
        if (response.err) {
          return res
            .status(500)
            .send({ err: response.err, message: "have a error" });
        }
        return res.status(200).send({ data: response, message: "Successfuly" });
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  }

  async login(req, res) {
    req.body.password = passwordToHash(req.body.password);
    baseService
      .login(req.body)
      .then((user) => {
        if (!user) {
          return res.status(500).send({ message: "User not found" });
        }

        let userData = {
          ...user.dataValues,
          userType: 1,
          token: {
            access_token: generateAccessToken({
              ...user.dataValues,
              userType: 1,
            }),
            refresh_token: generateRefreshToken({
              ...user.dataValues,
              userType: 1,
            }),
          },
        };

        delete user.password;
        res.status(200).send(userData);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  extraMethod() {}
}

module.exports = new UsersController();
