const BaseService = require("./BaseService");

// basemodel /models/....
const BaseModel = require("../models/Companies");

class CompaniesService extends BaseService {
  constructor() {
    super(BaseModel);
  }

  extraMethod() {}
}

module.exports = CompaniesService;
