const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

upvoteSchema = new mongoose.Schema({
    record : {
        type: ObjectId,
        ref: 'Resources'
    },
    positive:{
        type:Boolean, 
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

})

module.exports= mongoose.model('Feedback',upvoteSchema)