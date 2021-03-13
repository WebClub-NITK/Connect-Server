const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    author_id: {
        type: String,
    },
    title: {
        type: String,
        required: true,
        minlength: 6,
        index: true
    },
    coverImageUrl: {
        type: String,
    },
    body: {
        type: String,
        required: true,
        minlength: 10
    },
    tags: [{
        type: String,
        index: true
    }]
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)
