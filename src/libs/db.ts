import Knex from "knex";

// Create a connection pool to the database
export const dbConnectionPool = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  },
  pool: {
    min: 0,
    max: 20,
  },
  acquireConnectionTimeout: 30000
});