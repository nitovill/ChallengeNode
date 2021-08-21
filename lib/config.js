require("dotenv").config();

const config = {
  port: process.env.API_PORT || "3001",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "2610",
  dbHost: process.env.DB_HOST || "localhost",
  dbName: process.env.DB_NAME || "disney",
};

module.exports = config;
