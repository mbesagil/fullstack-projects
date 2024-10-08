const BaseService = require("./BaseService");

// basemodel /models/....
const BaseModel = require("../models/Users");
const BaseModelCompanies = require("../models/Companies");
const BaseModelCategories = require("../models/Categories");
const BaseModelProducts = require("../models/Products");

class UsersService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  async login(loginData) {
    // console.log("loginData :>> ", loginData);
    const user = await this.BaseModel.findOne({ where: loginData });
    // console.log("user :>> ", user);
    return user;
  }

  extraMethod() {}
}

module.exports = UsersService;
