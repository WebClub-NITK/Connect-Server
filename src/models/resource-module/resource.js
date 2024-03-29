const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    files: [String],
    tags: [String],
    description: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        min: 0,
    },
    dislikes: {
        type: Number,
        min: 0,
    },
    course:{
        type:ObjectId,
        ref: "Course"
    },
    user:{
        Id: {
            type: String,
            required:true
        },
        Username:{
            type: String,
            required:true
        }
    }

});

module.exports= mongoose.model('Resource', resourceSchema)