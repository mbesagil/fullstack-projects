import Joi from "joi";

const createValidation = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().email().required().min(6),
});

const loginValidation = Joi.object({
  password: Joi.string().required().min(6),
  email: Joi.string().email().required().min(6),
});

const tokenValidateValidation = Joi.object({
  token: Joi.string().required(),
});

const updateValidation = Joi.object({
  email: Joi.string().email().min(6),
});

const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().min(6),
});

const changePasswordValidation = Joi.object({
  password: Joi.string().required().min(6),
});

export default {
  createValidation,
  loginValidation,
  tokenValidateValidation,
  updateValidation,
  resetPasswordValidation,
  changePasswordValidation,
};
