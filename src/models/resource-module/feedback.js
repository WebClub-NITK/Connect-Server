const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

upvoteSchema = new mongoose.Schema({
    record : {
        type: ObjectId,
        ref: 'Resources'
    },
    // user:{
    //     type: ObjectId,
    //     ref: 'User'
    // },
    positive:{
        type:Boolean, 
    }
})

module.exports= mongoose.model('Feedback',upvoteSchema)