const BaseController = require("./BaseController");
const CategoriesService = require("../services/CategoriesService");

const baseService = new CategoriesService();

class CategoriesControllers extends BaseController {
  constructor() {
    super("a");
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

  async listByCompany(req, res) {
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

  async create(req, res) {
    console.log("req.body :>> ", req.body, req.user.id);
    req.body.user_id = req.user.id
    return await baseService
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

  extraMethod() {}
}

module.exports = new CategoriesControllers();
