require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DATABASE = process.env.DATABASE

module.exports = {
    development: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DATABASE,
        host: "127.0.0.1",
        dialect: "mysql"
    },
    test: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DATABASE,
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DATABASE,
        host: "127.0.0.1",
        dialect: "mysql"
    }
};
