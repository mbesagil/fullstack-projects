import CryptoJS from 'crypto-js';
import JWT from 'jsonwebtoken';

export const passwordToHash = (password) => {
  return CryptoJS.HmacSHA256(
    password,
    CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString()
  ).toString();
};

export const generateAccessToken = (user) => {
  return JWT.sign({ name: user.email, ...user }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1w' });
};

export const generateRefreshToken = (user) => {
  return JWT.sign({ name: user.email, ...user }, process.env.REFRESH_TOKEN_KEY);
};
