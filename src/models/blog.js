const mongoose = require('mongoose');
const { getUsers } = require('../services/connectServices');

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
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: String
    }]
}, { timestamps: true })

blogSchema.post('find', async (result, next) => {
    // this middleware works only if .lean() is called with the find method.
    // this middleware populates every blog with author details
    console.log('This is from the middleware')

    const authorIds = []
    for (blog of result) {
        if(blog.author_id){
            authorIds.push(blog.author_id)
        }
    }

    const userDetails = await getUsers(authorIds)

    for (blog of result) {
        const author = userDetails.find((user) => user.Id == blog.author_id)
        if(author) {
            blog.author_name = author['Profile.Name']
            blog.author_username = author.Username
        }
    }

    next()
})

module.exports = mongoose.model('Blog', blogSchema)
