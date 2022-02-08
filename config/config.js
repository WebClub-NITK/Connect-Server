const { DB_USER, DB_PASSWORD, DATABASE } = require("../src/utils/config");

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
