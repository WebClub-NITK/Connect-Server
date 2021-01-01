const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 6,
	},
	body: {
		type: String,
		required: true,
		minlength: 10
	},
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)