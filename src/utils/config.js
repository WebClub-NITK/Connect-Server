require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE

module.exports = {
	MONGODB_URI,
	PORT,
	PASSWORD,
	USER,
	DATABASE
}
