import express from 'express';
import { create, login, validateToken } from '../controllers/Users.js';
import validate from '../middlewares/validate.js';
import schemas from '../validations/Users.js';

const router = express.Router();

router.route('/login').post(validate(schemas.loginValidation), login);

router.route('/signup').post(validate(schemas.createValidation), create);

router.route('/verify-token').post(validate(schemas.tokenValidateValidation), validateToken);

export default router;
