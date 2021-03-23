require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI || ""
const USER = process.env.DB_USER
const PASSWORD = process.env.DB_PASSWORD
const DATABASE = process.env.DATABASE
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const DB_HOST = process.env.DB_HOST || 'localhost'
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001'

module.exports = {
    MONGODB_URI,
    PORT,
    PASSWORD,
    USER,
    DATABASE,
    ACCESS_TOKEN_SECRET,
    DB_HOST,
    SERVER_URL
}
