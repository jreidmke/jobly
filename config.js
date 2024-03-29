require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 3000;

// let baseURL = `postgresql://postgres:abc123@localhost/`;

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = `jobly-test`;
} else {
  DB_URI = process.env.DATABASE_URL || `jobly`;
}

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URI,
  BCRYPT_WORK_FACTOR
};
