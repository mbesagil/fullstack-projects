const BaseService = require("./BaseService");

// basemodel /models/....
const BaseModel = require("../models/Categories");
const Companies = require("../models/Companies");

class CategoriesService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  async list(body) {
    console.log("list");

    const options = {
      offset: 0,
      limit: 10,
      order: [["created_at", "DESC"]],
      where: {},
      include: [
        {
          model: Companies,
          as: "company",
        },
      ],
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

  extraMethod() {}
}

module.exports = CategoriesService;
