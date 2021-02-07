const { text } = require('express')
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const courseCommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    replies: [
        {
            text: String,
            likes: {
                type: Number,
                min: 0,
            },
            dislikes: {
                type: Number,
                min: 0,
            }
        }
    ],
    likes: {
        type: Number,
        min: 0,
    },
    dislikes: {
        type: Number,
        min: 0,
    },
    course:{
        type: ObjectId,
        ref: "Course"
    }
},{timestamps: true})

module.exports = mongoose.model('CourseComment', courseCommentSchema)