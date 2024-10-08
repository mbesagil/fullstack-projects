function successResponse(req, res, status, data, message) {
  res.status(status).send({ data: data, message: message || "" });
}

function errorResponse(req, res, status, err, message) {
  res.status(status).send({ err: err, message: message || "" });
}

module.exports = {
  successResponse,
  errorResponse,
};
