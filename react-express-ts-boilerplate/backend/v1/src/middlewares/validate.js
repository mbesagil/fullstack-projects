import httpStatus from "http-status";

const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error) {
    // [{message:""},{message:""},{message:""}]
    const errorMessage = error.details
      ?.map((detail) => detail.message)
      .join(", "); // Collects error messages into an array
    res.status(httpStatus.BAD_REQUEST).json({ error: errorMessage });
    return;
  }
  Object.assign(req, value);
  return next();
};

export default validate;
