const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const blogCommentsSchema = new mongoose.Schema({
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
            },
            user: {
                Id: {
                    type: String,
                    required:true
                },
                Username:{
                    type: String,
                    required:true
                }
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
        ref: "Blog"
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
},
{timestamps: true})

module.exports = mongoose.model('BlogComments', blogCommentsSchema)