const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const { v4: uuidv4, validate } = require("uuid");
const { Sequelize, DataTypes, Op } = require("sequelize");
const crypto = require("crypto");

const passwordToHash = (password) => {
  return CryptoJS.HmacSHA256(password, process.env.PASSWORD_HASH).toString();
};
const generateAccessToken = (user) => {
  if (user.password) {
    delete user.password;
  }
  console.log("generateAccessToken :>> user", user);
  return JWT.sign({ ...user }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1w",
  });
};
const generateRefreshToken = (user) => {
  return JWT.sign({ ...user }, process.env.REFRESH_TOKEN_KEY);
};

const parseUUID = (value) => {
  return Sequelize.literal(`'${value}'::uuid`);
};
function generateEmptyUUID() {
  return Sequelize.literal(`00000000-0000-0000-0000-000000000000::uuid`);
}

function encryptData(data, encryptionKey) {
  const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

function decryptData(encryptedData, encryptionKey) {
  const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}
function setEmptyStringsToNull(data) {
  try {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        // console.log(`Key: ${key}, Value: ${value}`);
        if (value === "") {
          data[key] = null;
        }
      }
    }
    return data;
  } catch (error) {
    console.error("Veri İşleme Hatası:", error);
    return null;
  }
}

module.exports = {
  passwordToHash,
  generateAccessToken,
  generateRefreshToken,
  parseUUID,
  validate,
  uuidv4,
  generateEmptyUUID,
  setEmptyStringsToNull,
};
