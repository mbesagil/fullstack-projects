const { setEmptyStringsToNull } = require("../util/helper");

// BaseModel = null;

class BaseService {
  constructor(model) {
    console.log("BaseService in model", model);
    this.BaseModel = model;
  }

  async list(body) {
    console.log("list");

    const options = {
      offset: 0,
      limit: 10,
      order: [["created_at", "DESC"]],
      where: {},
    };

    const page = Math.max(1, parseInt(body.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(body.limit, 10) || 10));
    options.limit = limit;
    const offset = (page - 1) * limit;
    options.offset = offset;
    const filter = body.where ? body.where : {};
    options.where = filter;
    if (body.orderby) {
      const { column, order } = body.orderby;
      options.order = [[column, order]];
    } else {
      options.order = [["created_at", "DESC"]];
    }
    if (body.group) {
      options.group = body.group;
    }
    if (body.attributes) {
      options.attributes = body.attributes;
    }
    if (body.include) {
      options.include = body.include;
    }

    console.log("options :>> ", options);

    let countOptions = { ...options };
    if (countOptions.order) {
      delete countOptions.order;
    }
    if (countOptions.offset) {
      delete countOptions.offset;
    }
    if (countOptions.limit) {
      delete countOptions.limit;
    }

    console.log("options :>> ", options);
    let dbData = await this.BaseModel.findAll(options)
      .then((res) => {
        // console.log("res :>> ", res);
        return res;
      })
      .catch((err) => {
        // console.log("err :>> ", err);
        return err;
      });

    console.log("countOptions :>> ", countOptions);
    let count = await this.BaseModel.count(countOptions)
      .then((res) => {
        // console.log("res :>> ", res);
        return res;
      })
      .catch((err) => {
        // console.log("err :>> ", err);
        return err;
      });

    return { data: dbData, total: count };
  }

  async findOne(where) {
    // console.log("where :>> ", where);
    return await this.BaseModel.findOne(where || {})
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return { err };
      });
  }

  async count(where) {
    return await this.BaseModel.count(where);
  }

  async create(payload) {
    // console.log("create payload :>> ", payload);
    const processData = setEmptyStringsToNull(payload);
    return await this.BaseModel.create(processData)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return { err: err };
      });
  }

  async update(payload, id) {
    const processData = setEmptyStringsToNull(payload);
    return await this.BaseModel.update(processData, {
      where: { id: id },
    })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return { err };
      });
  }

  async delete(id) {
    return await this.BaseModel.destroy({
      where: { id: id },
    })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return { err };
      });
  }

  async deleteAll(where) {
    return await this.BaseModel.destroy({
      where: where,
    })
      .then((response) => {
        return response;
      })
      .catch((err) => {
        return { err };
      });
  }
}

module.exports = BaseService;
