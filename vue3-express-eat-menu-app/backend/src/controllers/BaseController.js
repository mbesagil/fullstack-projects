// BaseServiceTest = null;

class BaseController {
  constructor(serviceObj) {
    console.log('serviceObj :>> ', serviceObj);
    this.BaseServiceTest = serviceObj; 
  }

  async getOne(req, res) {
    console.log("getOne", req.params.id);
    return await this.BaseServiceTest.findOne({ where: { id: req.params.id } })
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
    console.log('this.BaseServiceTest :>> ', this.BaseServiceTest);
    console.log("req.body :>> ", req.body);
    return await this.BaseServiceTest.list(req.body)
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
    console.log("req.body :>> ", req.body);
    return await this.BaseServiceTest.create(req.body)
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
    return await this.BaseServiceTest.update(req.body, req.params.id)
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
    return await this.BaseServiceTest.delete(req.params.id)
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
}

module.exports = BaseController;
